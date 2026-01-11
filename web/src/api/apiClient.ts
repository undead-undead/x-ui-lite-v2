import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_TIMEOUT } from '../config/constants';

export const API_PATHS = {
    AUTH_LOGIN: '/auth/login',
    AUTH_UPDATE: '/auth/update',
    SERVER_SYS_STATS: '/server/sysStats',
    SERVER_RESTART_XRAY: '/server/restartXray',
    SERVER_RESTART_PANEL: '/server/restartPanel',
    SERVER_START_XRAY: '/server/startXray',
    SERVER_STOP_XRAY: '/server/stopXray',
    SERVER_UPDATE_XRAY: '/server/updateXray',
    SERVER_GET_LOGS: '/server/getLogs',
    SERVER_EXPORT_DB: '/server/export-db',
    SERVER_IMPORT_DB: '/server/import-db',
    SERVER_UPDATE_CONFIG: '/server/updateConfig',
    SERVER_XRAY_RELEASES: '/server/xrayReleases',
    INBOUNDS: '/inbounds',
    CLIENTS: '/clients',
} as const;

const getBaseURL = () => {
    if (window.__WEB_ROOT__ && window.__WEB_ROOT__ !== "{{WEB_ROOT}}") {
        const root = window.__WEB_ROOT__;
        const normalizedRoot = root.endsWith('/') ? root : `${root}/`;
        return `${normalizedRoot}api`;
    }

    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const topRoutes = ['login', 'inbounds', 'settings', 'dashboard'];

    if (segments.length > 0 && !topRoutes.includes(segments[0])) {
        return `/${segments[0]}/api`;
    }

    return '/api';
};

export const apiClient = axios.create({
    timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use(
    (config) => {
        config.baseURL = getBaseURL();

        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]:', error.message);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const url = error.config?.url || '';
        const status = error.response?.status;

        if (status === 401) {
            const isAuthEndpoint =
                url.includes(API_PATHS.AUTH_LOGIN) ||
                url.includes(API_PATHS.AUTH_UPDATE);

            if (!isAuthEndpoint) {
                console.warn('[API] 401 Unauthorized - Logging out');
                useAuthStore.getState().logout();
            }
        }

        if (status && status >= 500) {
            console.error('[API Server Error]:', {
                url,
                status,
                message: error.message,
            });
        }

        return Promise.reject(error);
    }
);
