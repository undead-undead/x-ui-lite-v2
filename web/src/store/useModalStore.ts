import { create } from 'zustand';

import type { Inbound } from '../types/inbound';

interface ModalState {
    isOpen: boolean;
    editingNode: Inbound | null;
    openModal: (node?: Inbound) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    editingNode: null,
    openModal: (node) => set({ isOpen: true, editingNode: node || null }),
    closeModal: () => set({ isOpen: false, editingNode: null }),
}));