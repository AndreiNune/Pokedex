import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import Lista from '@/component/list';
import { getPokemon } from '@/integration/pokemonIntegration';

export default function Pokedex() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPokemon(151);
        setPokemon(data);
      } catch (e) {
        console.error('Erro ao carregar pokemons:', e);
        setErro('Nao foi possivel carregar a Pokedex.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalTipos = useMemo(() => {
    return new Set(pokemons.flatMap((pokemon) => pokemon.tipos)).size;
  }, [pokemons]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Primeira geracao</Text>
        <Text style={styles.title}>Pokedex</Text>
        <Text style={styles.subtitle}>
          {pokemons.length > 0
            ? `${pokemons.length} pokemons encontrados em ${totalTipos} tipos`
            : 'Listagem dos pokemons classicos da PokeAPI'}
        </Text>
      </View>

      <Lista
        pokemons={pokemons}
        loading={loading}
        erro={erro}
        columns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#211033',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
    backgroundColor: 'rgba(91, 33, 182, 0.34)',
    borderBottomColor: 'rgba(216, 180, 254, 0.18)',
    borderBottomWidth: 1,
  },
  eyebrow: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    marginBottom: 6,
  },
  title: {
    color: '#f5edff',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(245, 237, 255, 0.78)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});
