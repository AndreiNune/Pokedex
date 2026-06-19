import api from '@/integration/api';
import { TeamResponse } from '@/@types/team';

function authHeaders(token?: string) {
    return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function normalizeTeamResponse(data: any): TeamResponse {
    const payload = data?.data || data;
    const team = Array.isArray(payload)
        ? payload
        : payload?.team || payload?.pokemons || payload?.pokemon || payload?.teamPokemon || [];

    return {
        userId: payload?.userId || payload?.user_id || payload?.['user-id'],
        user_id: payload?.user_id,
        team: Array.isArray(team) ? team : [],
    };
}

export async function getTeam(userId: string, token?: string): Promise<TeamResponse> {
    const response = await api.get('/pokemon/v1/team', {
        params: {"user-id": userId},
        headers: authHeaders(token),
    })
    return normalizeTeamResponse(response.data);
}

export async function updateTeam(
    userId: string,
    removedPokemon: number,
    newPokemon: number,
    token?: string
): Promise<TeamResponse> {
    const response = await api.put('/pokemon/v1/team', null, {
        params: {
            'user-id': userId,
            'removed-pokemon': String(removedPokemon),
            'new-pokemon': String(newPokemon),
        },
        headers: authHeaders(token),
    })
    return normalizeTeamResponse(response.data);
}

export async function addCapturedPokemon(
    userId: string,
    pokemonId: number,
    token?: string
): Promise<void> {
    await api.put('/pokemon/v1/captured', null, {
        params: {
            'user-id': userId,
            'pokemon-id': String(pokemonId),
        },
        headers: authHeaders(token),
    });
}

export async function deleteCapturedPokemon(
    userId: string,
    pokemonId: number,
    token?: string
): Promise<void> {
    await api.delete('/pokemon/v1/captured', {
        params: {
            'user-id': userId,
            'pokemon-id': String(pokemonId),
        },
        headers: authHeaders(token),
    })
}
