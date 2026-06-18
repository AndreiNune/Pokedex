import api from '@/integration/api';
import { TeamResponse, TeamPokemon } from '@/@types/team';

export async function getTeam(userId: string, token: string): Promise<TeamResponse> {
    const response = await api.get<TeamResponse>('/pokemon/v1/team', {
        params: {"user-id": userId},
        headers: {Authorization: `Bearer ${token}`},
    })
    return response.data;
}

export async function updateTeam(
    userId: string,
    removedPokemon: number,
    newPokemon: number,
    token: string
): Promise<TeamResponse> {
    const response = await api.put<TeamResponse>('/pokemon/v1/team', null, {
        params: {
            'user-id': userId,
            'removed-pokemon': String(removedPokemon),
            'new-pokemon': String(newPokemon),
        },
        headers: {Authorization: `Bearer ${token}`},
    })
    return response.data;
}

export async function addCapturedPokemon(
    userId: string,
    pokemonId: number,
    token: string
): Promise<void> {
    await api.put()
}