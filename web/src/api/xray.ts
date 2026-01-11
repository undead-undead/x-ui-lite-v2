import { apiClient } from './apiClient';

export interface RealityKeysResponse {
    private_key: string;
    public_key: string;
}

/**
 * Generate Reality key pair (calls backend which calls xray x25519)
 */
export async function generateRealityKeys(): Promise<RealityKeysResponse> {
    const response = await apiClient.get<RealityKeysResponse>('/xray/generate-reality-keys');
    return response.data;
}
