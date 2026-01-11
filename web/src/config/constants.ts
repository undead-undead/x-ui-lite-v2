export const DASHBOARD_POLLING_INTERVAL = 3000;
export const SETTINGS_REDIRECT_DELAY = 3000;
export const API_TIMEOUT = 60000;

export const PORT_RANGE = {
    MIN: 10000,
    MAX: 60000,
} as const;

export const generateRandomPort = (): number => {
    return Math.floor(Math.random() * (PORT_RANGE.MAX - PORT_RANGE.MIN)) + PORT_RANGE.MIN;
};

export const STORAGE_KEYS = {
    AUTH: 'x-ui-auth',
    SETTINGS: 'x-ui-settings',
} as const;

export const DEFAULT_TRAFFIC_LIMIT_GB = 0;
export const DEFAULT_EXPIRY_DAYS = 0;
