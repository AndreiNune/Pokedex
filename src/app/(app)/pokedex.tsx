import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import Lista from '@/component/list';
import Navbar from '@/component/navbar';
import { getPokemon } from '@/integration/pokemonIntegration';
import { Colors } from '@/constants/colors';

export default function Pokedex() {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPokemon(151);
        setPokemon(data);
      } catch (e) {
        console.error('Erro ao carregar pokémons:', e);
        setErro('Não foi possível carregar a Pokédex.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalTipos = useMemo(() => {
    return new Set(pokemons.flatMap((pokemon) => pokemon.tipos)).size;
  }, [pokemons]);

  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;
  const subtitle = pokemons.length > 0
    ? `${pokemons.length} pokémons encontrados em ${totalTipos} tipos`
    : 'Listagem dos pokémons clássicos da PokeAPI';

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar
        eyebrow="Primeira geração"
        title="Pokédex"
        subtitle={subtitle}
      />

      <Lista
        pokemons={pokemons}
        loading={loading}
        erro={erro}
        columns={columns}
        style={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dashboard_background,
  },
  listContent: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
});
