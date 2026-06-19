import { AuthCredentials, AuthResponse, ProfileStats, UpdateProfileStatsRequest } from '@/@types/auth';
import api from '@/integration/api';

export async function register(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/v1/register', credentials);
    return response.data;
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/v1/login', credentials);
    return response.data;
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
    const response = await api.get<ProfileStats>(`/auth/v1/stats/${encodeURIComponent(userId)}`);
    return response.data;
}

export async function updateProfileStats(
    userId: string,
    stats: UpdateProfileStatsRequest
): Promise<ProfileStats> {
    const response = await api.put<ProfileStats>(`/auth/v1/stats/${encodeURIComponent(userId)}`, stats);
    return response.data;
}
