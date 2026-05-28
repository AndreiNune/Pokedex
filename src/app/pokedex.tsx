import React, {useEffect, useState} from 'react';

import {getPokemon} from '@/integration/pokemonIntegration';
import {Pokemon} from '@/@types/pokemon';

import {View, Text} from 'react-native';

export default function Pokedex() {
     conhfchst [loading, setLoading] = useState(true);
     const [pokemons, setPokemon] = useState<Pokemon[]>([]);

     useEffect(() => {
        async function loadData() {
            try {
                const data = await getPokemon(151);
                setPokemon(data);
            } catch (e) {
                console.error('Erro ao carregar pokémons:', e);
            } finally{
                setLoading(false);
            }
        }
        loadData();
        }, 
     []);

     return(
        <View>
            <Text>Pokedex</Text>
        </View>

     )
}