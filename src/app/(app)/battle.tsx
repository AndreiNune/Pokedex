import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import Button from '@/component/button';
import Navbar from '@/component/navbar';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getProfileStats, updateProfileStats } from '@/integration/authIntegration';
import { getTeam } from '@/integration/teamIntegration';
import { getPokemon } from '@/integration/pokemonIntegration';
import { addStoredCapturedPokemon, getStoredPokemonTeam } from '@/integration/pokemonBoxStorage';
import { TeamPokemon } from '@/@types/team';

type BattleRound = {
  playerPokemon: Pokemon;
  enemyPokemon: Pokemon;
  statName: string;
  playerValue: number;
  enemyValue: number;
  winner: 'player' | 'enemy' | 'draw';
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

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

export default function Battle() {
  const { userId, token } = useAuth();
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [playerTeam, setPlayerTeam] = useState<Pokemon[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<Pokemon[]>([]);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [reward, setReward] = useState<Pokemon | null>(null);
  const [battleResult, setBattleResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingReward, setSavingReward] = useState(false);
  const [isBattling, setIsBattling] = useState(false);
  const [battleCountdown, setBattleCountdown] = useState(0);
  const [battlePreview, setBattlePreview] = useState('Aguardando batalha');
  const [teamSource, setTeamSource] = useState('');

  const score = useMemo(() => {
    return rounds.reduce(
      (currentScore, round) => {
        if (round.winner === 'player') return { ...currentScore, player: currentScore.player + 1 };
        if (round.winner === 'enemy') return { ...currentScore, enemy: currentScore.enemy + 1 };
        return currentScore;
      },
      { player: 0, enemy: 0 }
    );
  }, [rounds]);

  useEffect(() => {
    async function loadBattleData() {
      try {
        const pokemons = await getPokemon(151);
        setAllPokemon(pokemons);
        setEnemyTeam(generateTeam(pokemons));

        if (!userId) return;

        let apiTeam: Pokemon[] = [];

        try {
          const response = await getTeam(userId, token || undefined);
          apiTeam = response.team
            .map((teamPokemon) => hydrateTeamPokemon(teamPokemon, pokemons))
            .filter((pokemon): pokemon is Pokemon => Boolean(pokemon))
            .slice(0, 5);
        } catch (error) {
          console.error('Erro ao buscar time da API:', error);
        }

        if (apiTeam.length === 5) {
          setPlayerTeam(apiTeam);
          setTeamSource('Usando time da API.');
          return;
        }

        const storedTeamIds = await getStoredPokemonTeam(userId);
        const storedTeam = storedTeamIds
          .map((id) => pokemons.find((pokemon) => pokemon.id === id))
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon));

        setPlayerTeam(storedTeam);
        setTeamSource(storedTeam.length === 5 ? 'Usando time local de teste.' : '');
      } catch (error) {
        console.error('Erro ao preparar batalha:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBattleData();
  }, [token, userId]);

  function generateTeam(pokemons: Pokemon[]) {
    return [...pokemons].sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runBattleAnimation() {
    const possibleStats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

    setIsBattling(true);
    setRounds([]);
    setReward(null);
    setBattleResult('');

    for (let remaining = 5; remaining > 0; remaining -= 1) {
      setBattleCountdown(remaining);
      setBattlePreview(`Escolhendo status: ${pickRandom(possibleStats)}`);
      await wait(1000);
    }

    setBattleCountdown(0);
    setBattlePreview('Status definidos. Calculando resultado...');
    await wait(250);
    setIsBattling(false);
  }

  async function rewardCapturedPokemon(capturedPokemon: Pokemon) {
    if (!userId) return;

    try {
      setSavingReward(true);
      await addStoredCapturedPokemon(userId, capturedPokemon.id);
    } catch (error) {
      console.error('Erro ao adicionar Pokemon capturado:', error);
    } finally {
      setSavingReward(false);
    }
  }

  async function updateBattleStats(playerWon: boolean) {
    if (!userId) return;

    try {
      const stats = await getProfileStats(userId);
      const currentLevel = Number(stats.level || 0);
      const currentWins = Number(stats.vitorias || 0);
      const currentLosses = Number(stats.derrotas || 0);

      await updateProfileStats(userId, {
        level: String(playerWon ? currentLevel + 1 : currentLevel),
        vitorias: String(playerWon ? currentWins + 1 : currentWins),
        derrotas: String(playerWon ? currentLosses : currentLosses + 1),
      });
    } catch (error) {
      console.error('Erro ao atualizar status de batalha:', error);
    }
  }

  async function startBattle() {
    if (isBattling || playerTeam.length < 5 || enemyTeam.length < 5) return;

    await runBattleAnimation();

    let playerWins = 0;
    let enemyWins = 0;
    const nextRounds: BattleRound[] = [];

    for (let index = 0; index < 5 && playerWins < 3 && enemyWins < 3; index += 1) {
      const playerPokemon = playerTeam[index];
      const enemyPokemon = enemyTeam[index];
      const playerStat = pickRandom(playerPokemon.poderes);
      const enemyStat = enemyPokemon.poderes.find((stat) => stat.nome === playerStat.nome) || pickRandom(enemyPokemon.poderes);

      let winner: BattleRound['winner'] = 'draw';

      if (playerStat.forca > enemyStat.forca) {
        winner = 'player';
        playerWins += 1;
      } else if (enemyStat.forca > playerStat.forca) {
        winner = 'enemy';
        enemyWins += 1;
      }

      nextRounds.push({
        playerPokemon,
        enemyPokemon,
        statName: playerStat.nome,
        playerValue: playerStat.forca,
        enemyValue: enemyStat.forca,
        winner,
      });
    }

    setRounds(nextRounds);

    if (playerWins >= 3) {
      const capturedPokemon = pickRandom(enemyTeam);
      setReward(capturedPokemon);
      setBattleResult('Vitoria! Um Pokemon do time inimigo foi enviado para sua box.');
      await rewardCapturedPokemon(capturedPokemon);
      await updateBattleStats(true);
      setEnemyTeam(generateTeam(allPokemon));
      return;
    }

    setReward(null);
    setBattleResult('Derrota. Reorganize seu time e tente novamente.');
    await updateBattleStats(false);
    setEnemyTeam(generateTeam(allPokemon));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar
        eyebrow="Arena"
        title="Batalha"
        subtitle="Vence quem chegar a 3 vitorias primeiro."
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary_blue} />
        ) : (
          <>
            <View style={styles.scoreCard}>
              <Text style={styles.cardTitle}>Placar</Text>
              <Text style={styles.scoreText}>Player {score.player} x {score.enemy} Inimigo</Text>
              {teamSource.length > 0 && <Text style={styles.description}>{teamSource}</Text>}
              {isBattling && (
                <View style={styles.animationBox}>
                  <ActivityIndicator size="small" color={Colors.primary_blue} />
                  <Text style={styles.animationText}>{battlePreview}</Text>
                  <Text style={styles.animationCountdown}>{battleCountdown}s</Text>
                </View>
              )}
              <Button
                title={isBattling ? 'Batalhando...' : 'Iniciar batalha'}
                onPress={startBattle}
                style={styles.button}
                disabled={isBattling || playerTeam.length < 5}
              />
              {playerTeam.length < 5 && (
                <Text style={styles.description}>Seu time precisa ter 5 Pokemon. Sorteie um time de teste na tela Times.</Text>
              )}
            </View>

            {battleResult.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Resultado</Text>
                <Text style={styles.description}>{battleResult}</Text>
                {savingReward && <Text style={styles.description}>Salvando recompensa...</Text>}
                {reward && (
                  <View style={styles.rewardBadge}>
                    {reward.imagem && <Image source={{ uri: reward.imagem }} style={styles.pokemonImage} />}
                    <Text style={styles.pokemonName}>{normalizeName(reward.nome)}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Rounds</Text>
              {rounds.length === 0 ? (
                <Text style={styles.description}>Nenhuma batalha iniciada.</Text>
              ) : (
                rounds.map((round, index) => (
                  <View key={`${round.playerPokemon.id}-${round.enemyPokemon.id}-${index}`} style={styles.roundRow}>
                    <Text style={styles.roundTitle}>Round {index + 1} - {round.statName}</Text>
                    <Text style={styles.description}>
                      {normalizeName(round.playerPokemon.nome)} ({round.playerValue}) x {normalizeName(round.enemyPokemon.nome)} ({round.enemyValue})
                    </Text>
                    <Text style={styles.winnerText}>
                      {round.winner === 'player' ? 'Ponto do player' : round.winner === 'enemy' ? 'Ponto inimigo' : 'Empate'}
                    </Text>
                  </View>
                ))
              )}
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
  scoreCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary_blue,
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
  scoreText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: Colors.gray,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
  },
  animationBox: {
    alignItems: 'center',
    backgroundColor: Colors.dashboard_background,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  animationText: {
    color: Colors.primary_blue,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
  animationCountdown: {
    color: Colors.dark_red,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  rewardBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark_red,
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  roundRow: {
    borderTopColor: Colors.input_border,
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  roundTitle: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  winnerText: {
    color: Colors.primary_blue,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
});
