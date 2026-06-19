import React, {createContext, useState, useContext, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from "@/@types/auth";
import { login } from "@/integration/authIntegration";

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    userId: string | null;
    token: string | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
}

const USER_STORAGE_KEY = '@Auth:user';
const USER_ID_STORAGE_KEY = '@Auth:userId';
const TOKEN_STORAGE_KEY = '@Auth:token';

function getAuthUsername(response: AuthResponse, fallback: string): string {
    return response.username || response.user?.username || response.data?.username || response.data?.user?.username || fallback.trim();
}

function getAuthUserId(response: AuthResponse): string | null {
    return (
        response.userId ||
        response.user_id ||
        response['user-id'] ||
        response.uuid ||
        response.sub ||
        response.id ||
        response.user?.userId ||
        response.user?.user_id ||
        response.user?.uuid ||
        response.user?.id ||
        response.data?.userId ||
        response.data?.user_id ||
        response.data?.['user-id'] ||
        response.data?.uuid ||
        response.data?.sub ||
        response.data?.id ||
        response.data?.user?.userId ||
        response.data?.user?.user_id ||
        response.data?.user?.uuid ||
        response.data?.user?.id ||
        null
    );
}

function getAuthToken(response: AuthResponse): string | null {
    return response.token || response.accessToken || response.access_token || response.data?.token || response.data?.accessToken || response.data?.access_token || null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData(){
            const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
            const storedUserId = await AsyncStorage.getItem(USER_ID_STORAGE_KEY);
            const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

            if(storedUser){
                setUser(storedUser);
                setUserId(storedUserId);
                setToken(storedToken);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }

        loadStorageData();
    }, []);

    async function signIn(username: string, password: string): Promise<boolean>{
        try {
            const response = await login({ username, password });

            const displayName = getAuthUsername(response, username);
            const authenticatedUserId = getAuthUserId(response);
            const authenticatedToken = getAuthToken(response);

            setUser(displayName);
            setUserId(authenticatedUserId);
            setToken(authenticatedToken);
            setIsAuthenticated(true);

            await AsyncStorage.setItem(USER_STORAGE_KEY, displayName);

            if (authenticatedUserId) {
                await AsyncStorage.setItem(USER_ID_STORAGE_KEY, authenticatedUserId);
            } else {
                await AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
            }

            if (authenticatedToken) {
                await AsyncStorage.setItem(TOKEN_STORAGE_KEY, authenticatedToken);
            } else {
                await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
            }

            return true;
        } catch (error) {
            console.error('Erro ao autenticar usuario:', error);
            return false;
        }
    }

    async function signOut(){
        setUser(null);
        setUserId(null);
        setToken(null);
        setIsAuthenticated(false);
        await AsyncStorage.multiRemove([USER_STORAGE_KEY, USER_ID_STORAGE_KEY, TOKEN_STORAGE_KEY]);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userId, token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);
