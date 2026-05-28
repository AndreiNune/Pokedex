import axios from 'axios';
import { Pokemon } from '@/@types/pokemon';

const API_URL = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
});

export const getPokemon = async (limit = 151): Promise<Pokemon[]> => {
    // 1. Correção: A PokeAPI retorna os dados dentro de 'results'
    const response = await API_URL.get(`/pokemon?limit=${limit}`);
    const list = response.data.results; 

    // 2. Correção: Adicionado o 'return' para receber a lista final de Promessas
    const pokemonDetail = await Promise.all(
        list.map(async (pokemon: { url: string }) => {
            // 3. Correção: Usando o axios puro aqui, pois pokemon.url já é a URL completa
            const pokemonValues = await axios.get(pokemon.url);
            const dadoPokemon = pokemonValues.data;

            // 4. Correção: Adicionado o 'return' do objeto mapeado
            return {
                id: dadoPokemon.id, // Adicionado ID numérico para o keyExtractor
                index: dadoPokemon.id.toString().padStart(3, '0'),
                nome: dadoPokemon.name,
                imagem: dadoPokemon.sprites.front_default,
                tipos: dadoPokemon.types.map((t: any) => t.type.name),
                poderes: dadoPokemon.stats.map((s: any) => ({
                    nome: s.stat.name,
                    forca: s.base_stat,
                }))
            };
        })
    );

    return pokemonDetail; // 5. Correção: Retorna a lista final de Pokémon estruturados
}
