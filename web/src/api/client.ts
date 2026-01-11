import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/api';

/**
 * Client related API
 */
export const clientApi = {
    /**
     * Get all clients
     */
    getClients: async (): Promise<ApiResponse> => {
        const response = await apiClient.get('/clients');
        return response.data;
    },

    /**
     * Get a single client
     * @param id - Client ID
     */
    getClient: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.get(`/clients/${id}`);
        return response.data;
    },

    /**
     * Create a client
     * @param data - Client data
     */
    createClient: async (data: any): Promise<ApiResponse> => {
        const response = await apiClient.post('/clients', data);
        return response.data;
    },

    /**
     * Update client
     * @param id - Client ID
     * @param data - Updated data
     */
    updateClient: async (id: string, data: any): Promise<ApiResponse> => {
        const response = await apiClient.put(`/clients/${id}`, data);
        return response.data;
    },

    /**
     * Delete client
     * @param id - Client ID
     */
    deleteClient: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/clients/${id}`);
        return response.data;
    },
};
