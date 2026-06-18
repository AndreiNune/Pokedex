export interface TeamPokemon {
    id: number;
    nome?: string;
    imagem?: string;
    tipos?: string[];
}

export interface TeamResponse {
    userId: string;
    team: TeamPokemon[];
}

