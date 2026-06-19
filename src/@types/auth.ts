export interface AuthCredentials {
    username: string;
    password: string;
}

export interface AuthUser {
    id?: string;
    userId?: string;
    user_id?: string;
    uuid?: string;
    username?: string;
}

export interface AuthResponse {
    id?: string;
    userId?: string;
    user_id?: string;
    uuid?: string;
    sub?: string;
    ['user-id']?: string;
    username?: string;
    token?: string;
    accessToken?: string;
    access_token?: string;
    user?: AuthUser;
    data?: AuthResponse;
}

export interface ProfileStats {
    userId?: string;
    username?: string;
    level: string;
    vitorias: string;
    derrotas: string;
}

export interface UpdateProfileStatsRequest {
    level: string;
    vitorias: string;
    derrotas: string;
}
