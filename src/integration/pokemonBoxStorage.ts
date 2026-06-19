import AsyncStorage from '@react-native-async-storage/async-storage';

const BOX_STORAGE_PREFIX = '@PokemonBox:';
const TEAM_STORAGE_PREFIX = '@PokemonTeam:';

function getBoxKey(userId: string) {
    return `${BOX_STORAGE_PREFIX}${userId}`;
}

function getTeamKey(userId: string) {
    return `${TEAM_STORAGE_PREFIX}${userId}`;
}

export async function getStoredPokemonBox(userId: string): Promise<number[]> {
    const value = await AsyncStorage.getItem(getBoxKey(userId));
    if (!value) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed.filter((id) => typeof id === 'number')
            : [];
    } catch {
        return [];
    }
}

export async function addStoredCapturedPokemon(userId: string, pokemonId: number): Promise<number[]> {
    const currentBox = await getStoredPokemonBox(userId);
    const nextBox = Array.from(new Set([...currentBox, pokemonId]));
    await AsyncStorage.setItem(getBoxKey(userId), JSON.stringify(nextBox));
    return nextBox;
}

export async function removeStoredCapturedPokemon(userId: string, pokemonId: number): Promise<number[]> {
    const nextBox = (await getStoredPokemonBox(userId)).filter((id) => id !== pokemonId);
    await AsyncStorage.setItem(getBoxKey(userId), JSON.stringify(nextBox));
    return nextBox;
}

export async function getStoredPokemonTeam(userId: string): Promise<number[]> {
    const value = await AsyncStorage.getItem(getTeamKey(userId));
    if (!value) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed.filter((id) => typeof id === 'number').slice(0, 5)
            : [];
    } catch {
        return [];
    }
}

export async function setStoredPokemonTeam(userId: string, pokemonIds: number[]): Promise<number[]> {
    const nextTeam = Array.from(new Set(pokemonIds.filter((id) => typeof id === 'number'))).slice(0, 5);
    await AsyncStorage.setItem(getTeamKey(userId), JSON.stringify(nextTeam));
    return nextTeam;
}
