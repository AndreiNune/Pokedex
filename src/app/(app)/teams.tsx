import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Pokemon } from '@/@types/pokemon';
import { TeamPokemon } from '@/@types/team';
import Button from '@/component/button';
import Navbar from '@/component/navbar';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getPokemon } from '@/integration/pokemonIntegration';
import { getTeam } from '@/integration/teamIntegration';
import { getStoredPokemonTeam, setStoredPokemonTeam } from '@/integration/pokemonBoxStorage';

function normalizeName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTeamPokemonId(teamPokemon: TeamPokemon | number | string) {
  if (typeof teamPokemon === 'number') return teamPokemon;
  if (typeof teamPokemon === 'string') return Number(teamPokemon);
  return Number(teamPokemon.pokemonId ?? teamPokemon.pokemon_id ?? teamPokemon.pokemon?.id ?? teamPokemon.id);
}

function hydrateTeamPokemon(teamPokemon: TeamPokemon | number | string, pokemonList: Pokemon[]) {
  const pokemonId = getTeamPokemonId(teamPokemon);
  if (!Number.isFinite(pokemonId)) return null;

  const pokemonDetails = pokemonList.find((pokemon) => pokemon.id === pokemonId);
  if (pokemonDetails) return pokemonDetails;

  if (typeof teamPokemon !== 'object') return null;

  const name = teamPokemon.nome || teamPokemon.name || teamPokemon.pokemon?.nome || teamPokemon.pokemon?.name;
  if (!name) return null;

  return {
    id: pokemonId,
    index: pokemonId.toString().padStart(3, '0'),
    nome: name,
    imagem: teamPokemon.imagem || teamPokemon.image || teamPokemon.pokemon?.imagem || teamPokemon.pokemon?.image || '',
    tipos: teamPokemon.tipos || teamPokemon.pokemon?.tipos || [],
    poderes: [],
  };
}

export default function Teams() {
  const router = useRouter();
  const { userId, token } = useAuth();

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [playerTeam, setPlayerTeam] = useState<Pokemon[]>([]);
  const [teamSource, setTeamSource] = useState('');
  const [loadingPlayerTeam, setLoadingPlayerTeam] = useState(true);
  const [randomizingTeam, setRandomizingTeam] = useState(false);

  useEffect(() => {
    async function loadPlayerTeam() {
      try {
        setLoadingPlayerTeam(true);
        const pokemons = await getPokemon(151);
        setAllPokemon(pokemons);

        if (!userId) return;

        let apiTeam: Pokemon[] = [];

        try {
          const response = await getTeam(userId, token || undefined);
          apiTeam = (response.team || [])
            .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, pokemons))
            .filter((pokemon): pokemon is Pokemon => Boolean(pokemon))
            .slice(0, 5);
        } catch (error) {
          console.error('Erro ao buscar time da API:', error);
        }

        if (apiTeam.length === 5) {
          setPlayerTeam(apiTeam);
          setTeamSource('Time carregado da API.');
          return;
        }

        const storedTeamIds = await getStoredPokemonTeam(userId);
        const storedTeam = storedTeamIds
          .map((id) => pokemons.find((pokemon) => pokemon.id === id))
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

        if (storedTeam.length === 5) {
          setPlayerTeam(storedTeam);
          setTeamSource('Time local de teste.');
          return;
        }

        setPlayerTeam([]);
        setTeamSource('Nenhum time foi encontrado para este jogador.');
      } catch (error) {
        console.error('Erro ao buscar time do jogador:', error);
      } finally {
        setLoadingPlayerTeam(false);
      }
    }

    loadPlayerTeam();
  }, [token, userId]);

  async function randomizeLocalTeam() {
    if (!userId || allPokemon.length === 0) return;

    try {
      setRandomizingTeam(true);
      const nextTeam = [...allPokemon].sort(() => 0.5 - Math.random()).slice(0, 5);
      await setStoredPokemonTeam(userId, nextTeam.map((pokemon) => pokemon.id));
      setPlayerTeam(nextTeam);
      setTeamSource('Time local de teste.');
    } catch (error) {
      console.error('Erro ao sortear time local:', error);
    } finally {
      setRandomizingTeam(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar
        eyebrow="Player"
        title="Times Pokemon"
        subtitle="Seu time salvo no banco."
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meu Time Atual</Text>

          {loadingPlayerTeam ? (
            <ActivityIndicator size="small" color={Colors.primary_blue} style={styles.loader} />
          ) : playerTeam.length > 0 ? (
            <>
              <Text style={styles.sourceText}>{teamSource}</Text>
              <View style={styles.memberGrid}>
                {playerTeam.map((pokemon) => (
                  <View key={`player-${pokemon.id}`} style={styles.memberBadge}>
                    {pokemon.imagem && (
                      <Image source={{ uri: pokemon.imagem }} style={styles.pokemonImage} />
                    )}
                    <Text style={styles.pokemonName}>{normalizeName(pokemon.nome)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.cardDescription}>
              {teamSource || 'Nenhum time foi encontrado para este jogador.'}
            </Text>
          )}

          <Button
            title={randomizingTeam ? 'Sorteando...' : 'Sortear time de teste'}
            onPress={randomizeLocalTeam}
            disabled={loadingPlayerTeam || randomizingTeam || allPokemon.length === 0}
            style={styles.randomButton}
          />
        </View>

        <Button title="Abrir Box Pokemon" onPress={() => router.push('/box')} style={styles.button} />
        <Button title="Voltar para Pokedex" onPress={() => router.push('/pokedex')} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dashboard_background,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 14,
  },
  pokemonImage: {
    width: 40,
    height: 40,
    marginRight: 4,
  },
  pokemonName: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    color: Colors.primary_blue,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDescription: {
    color: Colors.gray,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  memberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary_blue,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceText: {
    color: Colors.gray,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  randomButton: {
    marginTop: 16,
    backgroundColor: Colors.primary_blue,
  },
  button: {
    marginTop: 12,
  },
  loader: {
    marginVertical: 10,
  },
});
