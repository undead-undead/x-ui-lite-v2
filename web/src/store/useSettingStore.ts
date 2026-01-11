import { create } from 'zustand';
import type { AllSettings, SettingStore, PanelConfig } from '../types/setting';
import { useDialogStore } from './useDialogStore';
import { SETTINGS_REDIRECT_DELAY } from '../config/constants';
import i18n from '../i18n/config';

const INITIAL_DATA: AllSettings = {
    panel: {
        listenIp: '',
        port: Number(window.location.port) || (window.location.protocol === 'https:' ? 443 : 80),
        webRoot: (window as any).__WEB_ROOT__ || window.location.pathname,
        sslCertPath: '',
        sslKeyPath: ''
    },
    auth: { oldUsername: '', oldPassword: '', newUsername: '', newPassword: '' },
};

export const useSettingStore = create<SettingStore>((set, get) => ({
    ...INITIAL_DATA,
    isRestarting: false,
    savedPanel: null,

    updatePanel: (data) => set((state) => {
        const { port, listenIp, webRoot, sslCertPath, sslKeyPath } = data;
        const nextPanel: PanelConfig = { ...state.panel };
        if (port !== undefined) nextPanel.port = Number(port) || 0;
        if (listenIp !== undefined) nextPanel.listenIp = String(listenIp);
        if (webRoot !== undefined) nextPanel.webRoot = String(webRoot);
        if (sslCertPath !== undefined) nextPanel.sslCertPath = String(sslCertPath);
        if (sslKeyPath !== undefined) nextPanel.sslKeyPath = String(sslKeyPath);
        return { panel: nextPanel };
    }),

    updateAuth: (data) => set((state) => ({
        auth: { ...state.auth, ...data }
    })),

    savePanelConfig: () => {
        const { panel } = get();

        if (panel.port < 1 || panel.port > 65535) {
            useDialogStore.getState().showAlert("Invalid port (1-65535)", "Config Error");
            return;
        }

        let normalizedWebRoot = panel.webRoot.trim();
        normalizedWebRoot = normalizedWebRoot.replace(/\/+/g, '/');

        if (!normalizedWebRoot.startsWith('/')) {
            normalizedWebRoot = '/' + normalizedWebRoot;
        }

        if (normalizedWebRoot.length > 1 && !normalizedWebRoot.endsWith('/')) {
            normalizedWebRoot = normalizedWebRoot + '/';
        }

        const updatedPanel = { ...panel, webRoot: normalizedWebRoot };
        set({
            panel: updatedPanel,
            savedPanel: updatedPanel
        });

        (async () => {
            const { sysApi } = await import('../api/system');
            try {
                await sysApi.updateConfig(normalizedWebRoot, panel.port);
            } catch (e) {
                console.error("Failed to update backend config:", e);
                useDialogStore.getState().showAlert("Backend config write failed, please check logs", "Error");
                return;
            }

            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const newPort = panel.port;
            const fullUrl = `${protocol}//${hostname}:${newPort}${normalizedWebRoot}`;

            useDialogStore.getState().showAlert(
                `Configuration saved!\n\nPanel service is restarting...\nThe page will try to redirect to:\n${fullUrl} in 5 seconds.\n\n⚠️ PLEASE REMEMBER THE NEW ADDRESS!\n\nNote: If you are using a cloud server, make sure to update your firewall rules!`,
                "Save Success"
            );

            try {
                await sysApi.restartPanel();
            } catch (e) {
                console.warn("Restart signal failed (this is normal if process killed):", e);
            }

            setTimeout(() => {
                window.location.href = fullUrl;
            }, SETTINGS_REDIRECT_DELAY);
        })();
    },

    confirmUpdateAuth: () => {
        const { auth } = get();
        const { oldUsername, oldPassword, newUsername, newPassword } = auth;

        const alphanumericRegex = /^[a-zA-Z0-9]+$/;

        if (newUsername && !alphanumericRegex.test(newUsername)) {
            useDialogStore.getState().showAlert("Username can only contain letters and numbers", "Format Error");
            return;
        }

        if (newPassword && !alphanumericRegex.test(newPassword)) {
            useDialogStore.getState().showAlert("Password can only contain letters and numbers", "Format Error");
            return;
        }

        if (newUsername && newUsername === oldUsername && !newPassword) {
            useDialogStore.getState().showAlert("New username cannot be the same as the old one", "Validation Failed");
            return;
        }

        const finalUsername = newUsername || oldUsername || 'admin';
        const finalPassword = newPassword || oldPassword;

        useDialogStore.getState().showConfirm(
            `Are you sure you want to change admin credentials?\n\nYou will be logged out immediately and need to log in with new credentials.`,
            () => {
                (async () => {
                    try {
                        const { sysApi } = await import('../api/system');

                        if (!oldUsername) {
                            useDialogStore.getState().showAlert("Please enter old username to verify identity", "Validation Failed");
                            return;
                        }
                        if (!oldPassword) {
                            useDialogStore.getState().showAlert("Please enter old password to verify identity", "Validation Failed");
                            return;
                        }

                        await sysApi.updateCredentials({
                            oldUsername,
                            oldPassword,
                            newUsername: finalUsername,
                            newPassword: finalPassword
                        });

                        set({ auth: { oldUsername: '', oldPassword: '', newUsername: '', newPassword: '' } });

                        const { useAuthStore } = await import('./useAuthStore');
                        useAuthStore.getState().logout();
                    } catch (error: any) {
                        console.error("Update credentials failed:", error);
                        const msg = error.response?.data?.msg || "Old username or password incorrect";
                        useDialogStore.getState().showAlert(
                            `Update failed: ${msg}\n\nPlease ensure "Old Username" and "Old Password" are correct.`,
                            "Update Failed"
                        );
                    }
                })();
            },
            "Confirm Update"
        );
    },

    restartPanel: () => {
        useDialogStore.getState().showConfirm(
            "Force restart panel service? This will disconnect all current connections.",
            async () => {
                const { panel } = get();
                const { sysApi } = await import('../api/system');
                set({ isRestarting: true });

                useDialogStore.getState().showAlert(
                    "Panel is restarting, please wait...",
                    "Restarting"
                );

                try {
                    await sysApi.restartPanel();
                } catch (e) {
                    console.warn("Restart signal failed (this is normal if process killed):", e);
                }

                const cleanRoot = panel.webRoot.startsWith('/') ? panel.webRoot : `/${panel.webRoot}`;
                const origin = window.location.origin;
                const newAddress = `${origin}${cleanRoot}`;

                setTimeout(() => {
                    window.location.href = newAddress;
                }, SETTINGS_REDIRECT_DELAY);
            },
            "Confirm Restart"
        );
    },

    exportDb: async () => {
        try {
            const { sysApi } = await import('../api/system');
            await sysApi.exportDb();
        } catch (error) {
            console.error("Export failed:", error);
            useDialogStore.getState().showAlert(i18n.t('settings.backup.export_error'), "Export Error");
        }
    },

    importDb: async (file: File) => {
        try {
            const { sysApi } = await import('../api/system');
            await sysApi.importDb(file);

            useDialogStore.getState().showAlert(
                i18n.t('settings.backup.import_success_msg'),
                i18n.t('settings.backup.import_success_title')
            );

            // Auto restart panel to apply changes
            set({ isRestarting: true });
            try {
                await sysApi.restartPanel();
            } catch (e) {
                console.warn("Restart signal failed (likely connection lost due to restart):", e);
            }

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error: any) {
            console.error("Import failed:", error);
            const msg = error.response?.data?.msg || i18n.t('settings.backup.import_error_msg');
            useDialogStore.getState().showAlert(msg, i18n.t('settings.backup.import_error_title'));
        }
    }
}));