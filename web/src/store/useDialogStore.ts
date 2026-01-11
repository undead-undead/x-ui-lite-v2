import { create } from 'zustand';

interface DialogState {
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}

interface DialogStore extends DialogState {
    showAlert: (message: string, title?: string, onConfirm?: () => void) => void;
    showConfirm: (message: string, onConfirm: () => void, title?: string) => Promise<boolean>;
    close: () => void;
}

export const useDialogStore = create<DialogStore>((set, get) => ({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,

    showAlert: (message: string, title: string = 'Info', onConfirm?: () => void) => {
        set({
            isOpen: true,
            type: 'alert',
            title,
            message,
            confirmText: 'OK',
            onConfirm: () => {
                get().close();
                if (onConfirm) onConfirm();
            },
            onCancel: null,
        });
    },

    showConfirm: (message: string, onConfirm: () => void, title: string = 'Confirm') => {
        return new Promise((resolve) => {
            set({
                isOpen: true,
                type: 'confirm',
                title,
                message,
                confirmText: 'OK',
                cancelText: 'Cancel',
                onConfirm: () => {
                    get().close();
                    setTimeout(() => {
                        onConfirm();
                        resolve(true);
                    }, 0);
                },
                onCancel: () => {
                    get().close();
                    resolve(false);
                },
            });
        });
    },

    close: () => {
        set({
            isOpen: false,
            onConfirm: null,
            onCancel: null,
        });
    },
}));
