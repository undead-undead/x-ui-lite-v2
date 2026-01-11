import { create } from 'zustand';
import type { Inbound } from '../types/inbound';

interface QRCodeStore {
    isOpen: boolean;
    inbound: Inbound | null;
    open: (inbound: Inbound) => void;
    close: () => void;
}

export const useQRCodeStore = create<QRCodeStore>((set) => ({
    isOpen: false,
    inbound: null,
    open: (inbound) => set({ isOpen: true, inbound }),
    close: () => set({ isOpen: false, inbound: null }),
}));
