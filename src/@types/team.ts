export interface TeamPokemon {
    id: number;
    pokemonId?: number;
    pokemon_id?: number;
    pokemon?: TeamPokemon;
    nome?: string;
    name?: string;
    imagem?: string;
    image?: string;
    tipos?: string[];
}

export interface TeamResponse {
    userId?: string;
    user_id?: string;
    team: Array<TeamPokemon | number | string>;
}

export interface UpdateTeamRequest {
    userId: string;
    removedPokemon: number;
    newPokemon: number;
}

export interface CapturedPokemonRequest {
    userId: string;
    pokemonId: number;
}
