export interface PanelConfig {
    listenIp: string;
    port: number;
    webRoot: string;
    sslCertPath: string;
    sslKeyPath: string;
}

export interface AuthConfig {
    oldUsername: string;
    oldPassword: string;
    newUsername: string;
    newPassword: string;
}

export interface AllSettings {
    panel: PanelConfig;
    auth: AuthConfig;
}

export interface SettingStore extends AllSettings {
    isRestarting: boolean;
    savedPanel: PanelConfig | null;
    updatePanel: (data: Partial<Record<keyof PanelConfig, string | number>>) => void;
    updateAuth: (data: Partial<AuthConfig>) => void;
    savePanelConfig: () => void;
    confirmUpdateAuth: () => void;
    restartPanel: () => void;
    exportDb: () => Promise<void>;
    importDb: (file: File) => Promise<void>;
}