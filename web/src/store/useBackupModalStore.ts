import { create } from 'zustand';

interface BackupModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useBackupModalStore = create<BackupModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
