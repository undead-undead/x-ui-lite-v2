export interface ApiResponse<T = any> {
    success: boolean;
    msg: string;
    obj: T;
}

export interface SystemMemory {
    current: number;
    total: number;
}

export interface SystemDisk {
    current: number;
    total: number;
}

export interface XrayStatus {
    state: 'running' | 'stop' | 'error';
    version: string;
}

export interface NetworkTraffic {
    sent: number;
    recv: number;
}

export interface NetworkIO {
    up: number;
    down: number;
}

export interface SystemStatusData {
    cpu: number;
    mem: SystemMemory;
    swap: SystemMemory;
    disk: SystemDisk;
    uptime: number;
    load: number[];
    xray: XrayStatus;
    tcpCount: number;
    udpCount: number;
    netTraffic: NetworkTraffic;
    netIo: NetworkIO;
}

export type ApiSysStatus = ApiResponse<SystemStatusData>;

export interface UpdateCredentialsRequest {
    oldUsername: string;
    oldPassword: string;
    newUsername: string;
    newPassword: string;
}

export type ApiLogsResponse = ApiResponse<string[]>;

export interface UpdateXrayVersionRequest {
    version: string;
}
