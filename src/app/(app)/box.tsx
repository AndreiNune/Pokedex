import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import { TeamPokemon } from '@/@types/team';
import Button from '@/component/button';
import Navbar from '@/component/navbar';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getPokemon } from '@/integration/pokemonIntegration';
import { getTeam, updateTeam } from '@/integration/teamIntegration';
import {
  addStoredCapturedPokemon,
  getStoredPokemonBox,
  removeStoredCapturedPokemon,
} from '@/integration/pokemonBoxStorage';

function normalizeName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTeamPokemonId(teamPokemon: TeamPokemon | number | string) {
  if (typeof teamPokemon === 'number') return teamPokemon;
  if (typeof teamPokemon === 'string') return Number(teamPokemon);
  return Number(teamPokemon.pokemonId ?? teamPokemon.pokemon_id ?? teamPokemon.pokemon?.id ?? teamPokemon.id);
}

export default function Box() {
  const { userId, token } = useAuth();
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [boxIds, setBoxIds] = useState<number[]>([]);
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [selectedBoxPokemon, setSelectedBoxPokemon] = useState<Pokemon | null>(null);
  const [selectedTeamPokemon, setSelectedTeamPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const capturedPokemon = useMemo(() => {
    return boxIds
      .map((id) => allPokemon.find((pokemon) => pokemon.id === id))
      .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));
  }, [allPokemon, boxIds]);

  useEffect(() => {
    async function loadBoxData() {
      try {
        const pokemons = await getPokemon(151);
        setAllPokemon(pokemons);

        if (!userId) return;

        const [storedBox, teamResponse] = await Promise.all([
          getStoredPokemonBox(userId),
          getTeam(userId, token || undefined),
        ]);

        setBoxIds(storedBox);
        const apiTeam = (teamResponse.team || [])
          .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, pokemons))
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon))
          .slice(0, 5);

        setTeam(apiTeam);
      } catch (error) {
        console.error('Erro ao carregar box:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBoxData();
  }, [token, userId]);

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

  async function handleReplaceTeamPokemon() {
    if (!userId || !selectedBoxPokemon || !selectedTeamPokemon) {
      Alert.alert('Selecao obrigatoria', 'Escolha um Pokemon da box e um Pokemon do time.');
      return;
    }

    try {
      setSaving(true);
      const nextTeam = team.map((pokemon) =>
        pokemon.id === selectedTeamPokemon.id ? selectedBoxPokemon : pokemon
      );

      const response = await updateTeam(
        userId,
        selectedTeamPokemon.id,
        selectedBoxPokemon.id,
        token || undefined
      );
      const hydratedTeam = (response.team || [])
        .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, allPokemon))
        .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

      setTeam(hydratedTeam.length === 5 ? hydratedTeam : nextTeam);

      const boxWithoutAddedPokemon = await removeStoredCapturedPokemon(userId, selectedBoxPokemon.id);
      const nextBox = await addStoredCapturedPokemon(userId, selectedTeamPokemon.id);
      setBoxIds(Array.from(new Set([...boxWithoutAddedPokemon, ...nextBox])));

      setSelectedBoxPokemon(null);
      setSelectedTeamPokemon(null);
      Alert.alert('Time atualizado', 'Pokemon trocado com a box.');
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
      Alert.alert('Erro', 'Nao foi possivel atualizar o time.');
    } finally {
      setSaving(false);
    }
  }

  async function handleReleasePokemon() {
    if (!userId || !selectedBoxPokemon) {
      Alert.alert('Selecao obrigatoria', 'Escolha um Pokemon da box para liberar.');
      return;
    }

    try {
      setSaving(true);
      const nextBox = await removeStoredCapturedPokemon(userId, selectedBoxPokemon.id);
      setBoxIds(nextBox);
      setSelectedBoxPokemon(null);
    } catch (error) {
      console.error('Erro ao remover Pokemon capturado:', error);
      Alert.alert('Erro', 'Nao foi possivel remover este Pokemon da box.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar
        eyebrow="Capturados"
        title="Box Pokemon"
        subtitle="Guarde recompensas de batalha e monte seu time."
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary_blue} />
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Minha Box</Text>
              {capturedPokemon.length === 0 ? (
                <Text style={styles.description}>Venca batalhas para enviar Pokemon inimigos para sua box.</Text>
              ) : (
                <View style={styles.grid}>
                  {capturedPokemon.map((pokemon) => (
                    <TouchableOpacity
                      key={`box-${pokemon.id}`}
                      style={[
                        styles.pokemonBadge,
                        selectedBoxPokemon?.id === pokemon.id && styles.selectedBadge,
                      ]}
                      onPress={() => setSelectedBoxPokemon(pokemon)}
                    >
                      {pokemon.imagem && <Image source={{ uri: pokemon.imagem }} style={styles.pokemonImage} />}
                      <Text style={styles.pokemonName}>{normalizeName(pokemon.nome)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Time Atual</Text>
              {team.length === 0 ? (
                <Text style={styles.description}>Nenhum time salvo foi encontrado.</Text>
              ) : (
                <View style={styles.grid}>
                  {team.map((pokemon) => (
                    <TouchableOpacity
                      key={`team-${pokemon.id}`}
                      style={[
                        styles.teamBadge,
                        selectedTeamPokemon?.id === pokemon.id && styles.selectedBadge,
                      ]}
                      onPress={() => setSelectedTeamPokemon(pokemon)}
                    >
                  {pokemon.imagem && <Image source={{ uri: pokemon.imagem }} style={styles.pokemonImage} />}
                      <Text style={styles.pokemonName}>{normalizeName(pokemon.nome)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Acoes</Text>
              <Text style={styles.description}>
                Selecione um Pokemon da box e um Pokemon do time para fazer a troca.
              </Text>
              <Button
                title={saving ? 'Salvando...' : 'Adicionar ao time'}
                onPress={handleReplaceTeamPokemon}
                disabled={saving}
                style={styles.button}
              />
              <Button
                title="Liberar Pokemon da box"
                onPress={handleReleasePokemon}
                disabled={saving}
                style={styles.releaseButton}
              />
            </View>
          </>
        )}
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
    maxWidth: 760,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: Colors.white,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  cardTitle: {
    color: Colors.primary_blue,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: Colors.gray,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pokemonBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary_blue,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  teamBadge: {
    alignItems: 'center',
    backgroundColor: Colors.dark_red,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedBadge: {
    borderColor: Colors.light_purple,
    borderWidth: 2,
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
  button: {
    marginTop: 16,
  },
  releaseButton: {
    marginTop: 12,
    backgroundColor: Colors.danger,
  },
});
