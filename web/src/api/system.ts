import { apiClient, API_PATHS } from './apiClient';
import type {
    ApiSysStatus,
    ApiLogsResponse,
    UpdateCredentialsRequest,
    UpdateXrayVersionRequest,
    ApiResponse,
} from '../types/api';
import { downloadFile, generateTimestampedFilename } from '../utils/fileUtils';

/**
 * System API Interface
 */
export const sysApi = {
    /**
     * Update panel configuration (.env)
     */
    updateConfig: async (webRoot: string, port: number): Promise<ApiResponse> => {
        return (await apiClient.post<ApiResponse>(API_PATHS.SERVER_UPDATE_CONFIG, { webRoot, port })).data;
    },

    /**
     * Get real-time system status
     */
    getSystemStatus: async (): Promise<ApiSysStatus> => {
        const response = await apiClient.post<ApiSysStatus>(API_PATHS.SERVER_SYS_STATS);
        return response.data;
    },

    /**
     * Restart Xray service
     */
    restartXray: async (): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(API_PATHS.SERVER_RESTART_XRAY);
        return response.data;
    },
    restartPanel: async (): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(API_PATHS.SERVER_RESTART_PANEL);
        return response.data;
    },

    /**
     * Start Xray service
     */
    startXray: async (): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(API_PATHS.SERVER_START_XRAY);
        return response.data;
    },

    /**
     * Stop Xray service
     */
    stopXray: async (): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(API_PATHS.SERVER_STOP_XRAY);
        return response.data;
    },

    /**
     * Switch Xray version
     * @param version - Target version number
     */
    switchXrayVersion: async (version: string): Promise<ApiResponse> => {
        const payload: UpdateXrayVersionRequest = { version };
        const response = await apiClient.post<ApiResponse>(API_PATHS.SERVER_UPDATE_XRAY, payload);
        return response.data;
    },

    /**
     * Get all Xray releases
     */
    getXrayReleases: async (): Promise<ApiResponse<string[]>> => {
        const response = await apiClient.get<ApiResponse<string[]>>(API_PATHS.SERVER_XRAY_RELEASES);
        return response.data;
    },

    /**
     * Update user credentials (username and password)
     * @param data - Object containing old and new credentials
     */
    updateCredentials: async (data: UpdateCredentialsRequest): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>(API_PATHS.AUTH_UPDATE, data);
        return response.data;
    },

    /**
     * Get system logs
     */
    getLogs: async (): Promise<ApiLogsResponse> => {
        const response = await apiClient.post<ApiLogsResponse>(API_PATHS.SERVER_GET_LOGS);
        return response.data;
    },

    /**
     * Export database
     * Automatically downloads the database backup file
     */
    exportDb: async (): Promise<void> => {
        try {
            const response = await apiClient.get(API_PATHS.SERVER_EXPORT_DB, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const filename = generateTimestampedFilename('x-ui_backup', 'db');
            downloadFile(blob, filename);
        } catch (error) {
            console.error('[Export DB Error]:', error);
            throw error;
        }
    },

    /**
     * Import database
     * @param file - Database file
     */
    importDb: async (file: File): Promise<ApiResponse> => {
        const formData = new FormData();
        formData.append('db', file);

        const response = await apiClient.post<ApiResponse>(
            API_PATHS.SERVER_IMPORT_DB,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },
};
