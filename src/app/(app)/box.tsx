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
  getStoredPokemonTeam,
  removeStoredCapturedPokemon,
  setStoredPokemonTeam,
} from '@/integration/pokemonBoxStorage';

function normalizeName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTeamPokemonId(teamPokemon: TeamPokemon | number | string) {
  if (typeof teamPokemon === 'number') return teamPokemon;
  if (typeof teamPokemon === 'string') return Number(teamPokemon);
  return Number(teamPokemon.pokemonId ?? teamPokemon.pokemon_id ?? teamPokemon.pokemon?.id ?? teamPokemon.id);
}

function getPowerValue(pokemon: Pokemon | null, powerName: string) {
  return pokemon?.poderes.find((poder) => poder.nome === powerName)?.forca || 0;
}

function getBarColor(value: number) {
  if (value >= 90) return Colors.primary_blue;
  if (value >= 65) return Colors.dark_red;
  if (value >= 40) return Colors.light_red;
  return Colors.gray;
}

function getComparisonSymbol(leftValue: number, rightValue: number) {
  if (leftValue > rightValue) return '>';
  if (leftValue < rightValue) return '<';
  return '=';
}

function getDifferenceDescription(leftPokemon: Pokemon, rightPokemon: Pokemon, powerName: string, difference: number) {
  if (difference === 0) return `${normalizeName(leftPokemon.nome)} e ${normalizeName(rightPokemon.nome)} estao empatados em ${powerName}.`;

  const strongerPokemon = difference > 0 ? leftPokemon : rightPokemon;
  const weakerPokemon = difference > 0 ? rightPokemon : leftPokemon;
  return `${normalizeName(strongerPokemon.nome)} tem ${Math.abs(difference)} pontos a mais que ${normalizeName(weakerPokemon.nome)} em ${powerName}.`;
}

function PokemonSummary({ pokemon, title }: { pokemon: Pokemon | null; title: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      {pokemon ? (
        <View style={styles.summaryHeader}>
          {pokemon.imagem && <Image source={{ uri: pokemon.imagem }} style={styles.statusImage} />}
          <View style={styles.statusNameBox}>
            <Text style={styles.statusName}>{normalizeName(pokemon.nome)}</Text>
            <Text style={styles.statusTypes}>{pokemon.tipos.join(' / ') || 'Sem tipo'}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.description}>Selecione um Pokemon.</Text>
      )}
    </View>
  );
}

function PokemonComparisonCard({ boxPokemon, teamPokemon }: { boxPokemon: Pokemon | null; teamPokemon: Pokemon | null }) {
  const comparedPowers = boxPokemon?.poderes.length
    ? boxPokemon.poderes
    : teamPokemon?.poderes || [];

  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>Comparacao de Status</Text>

      <View style={styles.summaryGrid}>
        <PokemonSummary title="Pokemon da Box" pokemon={boxPokemon} />
        <PokemonSummary title="Pokemon do Time" pokemon={teamPokemon} />
      </View>

      {boxPokemon && teamPokemon ? (
        <View style={styles.comparisonList}>
          {comparedPowers.map((power) => {
            const boxValue = getPowerValue(boxPokemon, power.nome);
            const teamValue = getPowerValue(teamPokemon, power.nome);
            const difference = boxValue - teamValue;
            const symbol = getComparisonSymbol(boxValue, teamValue);

            return (
              <View key={`${boxPokemon.id}-${teamPokemon.id}-${power.nome}`} style={styles.comparisonRow}>
                <View style={styles.comparisonHeader}>
                  <Text style={styles.statusLabel}>{power.nome}</Text>
                  <Text style={[
                    styles.comparisonSymbol,
                    difference > 0 && styles.comparisonWin,
                    difference < 0 && styles.comparisonLose,
                  ]}>
                    {boxValue} {symbol} {teamValue}
                  </Text>
                </View>

                <View style={styles.barLine}>
                  <Text style={styles.barSideLabel}>Box</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: getBarColor(boxValue),
                          width: `${Math.min(boxValue, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{boxValue}</Text>
                </View>

                <View style={styles.barLine}>
                  <Text style={styles.barSideLabel}>Time</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: getBarColor(teamValue),
                          width: `${Math.min(teamValue, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{teamValue}</Text>
                </View>

                <Text style={styles.comparisonDescription}>
                  {getDifferenceDescription(boxPokemon, teamPokemon, power.nome, difference)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.description}>Selecione um Pokemon da box e um Pokemon do time para comparar.</Text>
      )}
    </View>
  );
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
  const [teamSource, setTeamSource] = useState('');

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

        const storedBox = await getStoredPokemonBox(userId);

        setBoxIds(storedBox);
        let apiTeam: Pokemon[] = [];

        try {
          const teamResponse = await getTeam(userId, token || undefined);
          apiTeam = (teamResponse.team || [])
            .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, pokemons))
            .filter((pokemon): pokemon is Pokemon => Boolean(pokemon))
            .slice(0, 5);
        } catch (error) {
          console.error('Erro ao buscar time da API:', error);
        }

        if (apiTeam.length === 5) {
          setTeam(apiTeam);
          setTeamSource('Time carregado da API.');
          return;
        }

        const storedTeamIds = await getStoredPokemonTeam(userId);
        const storedTeam = storedTeamIds
          .map((id) => pokemons.find((pokemon) => pokemon.id === id))
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

        setTeam(storedTeam);
        setTeamSource(storedTeam.length === 5 ? 'Time local de teste.' : '');
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

      let hydratedTeam: Pokemon[] = [];

      try {
        const response = await updateTeam(
          userId,
          selectedTeamPokemon.id,
          selectedBoxPokemon.id,
          token || undefined
        );
        hydratedTeam = (response.team || [])
          .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, allPokemon))
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));
      } catch (error) {
        console.error('Erro ao salvar time na API, mantendo troca local:', error);
      }

      const updatedTeam = hydratedTeam.length === 5 ? hydratedTeam : nextTeam;
      await setStoredPokemonTeam(userId, updatedTeam.map((pokemon) => pokemon.id));

      setTeam(updatedTeam);
      setTeamSource(hydratedTeam.length === 5 ? 'Time carregado da API.' : 'Time local de teste.');

      const boxWithoutAddedPokemon = await removeStoredCapturedPokemon(userId, selectedBoxPokemon.id);
      const nextBox = await addStoredCapturedPokemon(userId, selectedTeamPokemon.id);
      setBoxIds(nextBox);

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
              {teamSource.length > 0 && <Text style={styles.description}>{teamSource}</Text>}
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

            <View style={styles.detailsLayout}>
              <View style={styles.actionsColumn}>
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
              </View>

              <View style={styles.statusColumn}>
                <PokemonComparisonCard boxPokemon={selectedBoxPokemon} teamPokemon={selectedTeamPokemon} />
              </View>
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
  detailsLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionsColumn: {
    flex: 1,
    minWidth: 260,
  },
  statusColumn: {
    flex: 1,
    minWidth: 280,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  statusTitle: {
    color: Colors.primary_blue,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: Colors.dashboard_background,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 180,
    padding: 10,
  },
  summaryTitle: {
    color: Colors.primary_blue,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusImage: {
    height: 58,
    marginRight: 10,
    width: 58,
  },
  statusNameBox: {
    flex: 1,
  },
  statusName: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '800',
  },
  statusTypes: {
    color: Colors.gray,
    fontSize: 12,
    marginTop: 2,
  },
  comparisonList: {
    gap: 10,
  },
  comparisonRow: {
    borderTopColor: Colors.input_border,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  comparisonHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    color: Colors.black,
    fontSize: 13,
    fontWeight: '700',
  },
  comparisonSymbol: {
    color: Colors.dark_red,
    fontSize: 14,
    fontWeight: '800',
  },
  comparisonWin: {
    color: Colors.primary_blue,
  },
  comparisonLose: {
    color: Colors.danger,
  },
  barLine: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  barSideLabel: {
    color: Colors.gray,
    fontSize: 11,
    fontWeight: '800',
    width: 34,
  },
  barTrack: {
    backgroundColor: Colors.input_border,
    borderRadius: 8,
    flex: 1,
    height: 10,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 8,
    height: '100%',
  },
  barValue: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
    textAlign: 'right',
    width: 30,
  },
  comparisonDescription: {
    color: Colors.gray,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  button: {
    marginTop: 16,
  },
  releaseButton: {
    marginTop: 12,
    backgroundColor: Colors.danger,
  },
});
