import { create } from 'zustand';
import { sysApi } from '../api/system';
import { formatTraffic } from '../utils/format';

interface Traffic {
    up: string;
    down: string;
    totalUp: string;
    totalDown: string;
}

interface SysStatus {
    cpu: number;
    mem: { current: string; total: string; percent: number };
    swap: { current: string; total: string; percent: number };
    disk: { current: string; total: string; percent: number };
    uptime: string;
    load: string;
    xuiVersion: string;
    xrayVersion: string;
    xrayStatus: 'running' | 'stop' | 'error';
    tcpCount: number;
    udpCount: number;
    netTraffic: Traffic;
}

interface GlobalState {
    sysStatus: SysStatus;
    isLoading: boolean;
    error: string | null;
    fetchStatus: () => Promise<void>;
    restartXray: () => Promise<void>;
    startXray: () => Promise<void>;
    stopXray: () => Promise<void>;
    switchVersion: (version: string) => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
    sysStatus: {
        cpu: 0,
        mem: { current: '0 B', total: '0 B', percent: 0 },
        swap: { current: '0 B', total: '0 B', percent: 0 },
        disk: { current: '0 B', total: '0 B', percent: 0 },
        uptime: '0 days',
        load: '0 | 0 | 0',
        xuiVersion: 'v2.0.0',
        xrayVersion: 'unknown',
        xrayStatus: 'stop',
        tcpCount: 0,
        udpCount: 0,
        netTraffic: { up: '0 B/s', down: '0 B/s', totalUp: '0 B', totalDown: '0 B' }
    },
    isLoading: false,
    error: null,

    fetchStatus: async () => {
        try {
            set({ isLoading: true });
            const res = await sysApi.getSystemStatus();

            if (res.success) {
                const { obj } = res;

                set({
                    sysStatus: {
                        ...get().sysStatus,
                        cpu: obj.cpu,
                        mem: {
                            current: formatTraffic(obj.mem.current),
                            total: formatTraffic(obj.mem.total),
                            percent: parseFloat(((obj.mem.current / obj.mem.total) * 100).toFixed(2))
                        },
                        swap: {
                            current: formatTraffic(obj.swap.current),
                            total: formatTraffic(obj.swap.total),
                            percent: parseFloat(((obj.swap.current / obj.swap.total) * 100).toFixed(2))
                        },
                        disk: {
                            current: formatTraffic(obj.disk.current),
                            total: formatTraffic(obj.disk.total),
                            percent: parseFloat(((obj.disk.current / obj.disk.total) * 100).toFixed(2))
                        },
                        uptime: `${Math.floor(obj.uptime / 86400)} days`,
                        load: obj.load.join(' | '),
                        xrayVersion: obj.xray.version,
                        xrayStatus: obj.xray.state,
                        tcpCount: obj.tcpCount,
                        udpCount: obj.udpCount,
                        netTraffic: {
                            up: `${formatTraffic(obj.netIo.up)}/s`,
                            down: `${formatTraffic(obj.netIo.down)}/s`,
                            totalUp: formatTraffic(obj.netTraffic.sent),
                            totalDown: formatTraffic(obj.netTraffic.recv)
                        }
                    },
                    error: null
                });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    restartXray: async () => {
        try {
            const res = await sysApi.restartXray();
            if (!res.success) {
                throw new Error(res.msg);
            }
        } catch (err: any) {
            throw err;
        }
    },

    switchVersion: async (version: string) => {
        try {
            const res = await sysApi.switchXrayVersion(version);
            if (!res.success) {
                throw new Error(res.msg);
            }
        } catch (err: any) {
            throw err;
        }
    },

    startXray: async () => {
        try {
            const res = await sysApi.startXray();
            if (!res.success) {
                throw new Error(res.msg);
            }
        } catch (err: any) {
            throw err;
        }
    },

    stopXray: async () => {
        try {
            const res = await sysApi.stopXray();
            if (!res.success) {
                throw new Error(res.msg);
            }
        } catch (err: any) {
            throw err;
        }
    }
}));