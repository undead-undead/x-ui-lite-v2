
export interface Client {
    id?: string;
    flow?: string;
    level?: number;
    email?: string;
    password?: string;
    alterId?: number;
    method?: string;
}

export interface InboundSettings {
    clients?: Client[];
    decryption?: string;
    encryption?: string;
    method?: string;
    password?: string;
    network?: string;
    [key: string]: any;
}

export interface RealitySettings {
    show?: boolean;
    dest?: string;
    xver?: number;
    serverNames?: string[];
    privateKey?: string;
    publicKey?: string;
    shortIds?: string[];
    fingerprint?: string;
    minClientVer?: string;
    maxClientVer?: string;
    maxTimeDiff?: number;
    [key: string]: any;
}

export interface TlsSettings {
    serverName?: string;
    alpn?: string[];
    allowInsecure?: boolean;
    certificates?: any[];
    [key: string]: any;
}

export interface WsSettings {
    path?: string;
    headers?: {
        Host?: string;
        [key: string]: string | undefined;
    };
    [key: string]: any;
}

export interface GrpcSettings {
    serviceName?: string;
    multiMode?: boolean;
    [key: string]: any;
}

export interface HttpSettings {
    host?: string[];
    path?: string;
    [key: string]: any;
}

export interface Sockopt {
    tcpFastOpen?: boolean;
    tcpNoDelay?: boolean;
    acceptProxyProtocol?: boolean;
    [key: string]: any;
}

export interface StreamSettings {
    network?: string;
    security?: string;
    acceptProxyProtocol?: boolean;

    wsSettings?: WsSettings;
    grpcSettings?: GrpcSettings;
    httpSettings?: HttpSettings;
    tcpSettings?: any;
    kcpSettings?: any;
    quicSettings?: any;
    xhttpSettings?: any;

    tlsSettings?: TlsSettings;
    realitySettings?: RealitySettings;

    sockopt?: Sockopt;

    [key: string]: any;
}

export interface SniffingSettings {
    enabled: boolean;
    destOverride?: string[];
    metadataOnly?: boolean;
    routeOnly?: boolean;
}

export interface Inbound {
    id: string;
    remark: string;
    enable: boolean;
    port: number;
    protocol: string;

    tag?: string;
    listen?: string;
    allocate?: any;

    settings?: InboundSettings;
    streamSettings?: StreamSettings;
    sniffing?: SniffingSettings;

    up: number;
    down: number;
    total: number;
    expiry: number;

    createdAt?: string;
    updatedAt?: string;
}