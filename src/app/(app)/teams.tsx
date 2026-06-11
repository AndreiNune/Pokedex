import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import { Colors } from '@/constants/colors';
import { getPokemon } from '@/integration/pokemonIntegration'; // Ajuste o caminho do import da sua API aqui
import { Pokemon } from '@/@types/pokemon';

export default function Teams() {
  const router = useRouter();
  
  // Estados para gerenciar a lista completa da API, o time gerado e o loading
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [randomTeam, setRandomTeam] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Busca os 151 Pokémon logo ao carregar a tela
  useEffect(() => {
    async function loadPokemonData() {
      try {
        const data = await getPokemon(151);
        setAllPokemon(data);
        generateRandomTeam(data); // Gera o primeiro time assim que carrega
      } catch (error) {
        console.error("Erro ao buscar Pokémon para o time:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPokemonData();
  }, []);

  // Função que embaralha e seleciona 5 Pokémon únicos
  const generateRandomTeam = (pokemonList: Pokemon[]) => {
    if (pokemonList.length === 0) return;

    // Cria uma cópia da lista para não mutar o estado original
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    
    // Seleciona os 5 primeiros elementos do array embaralhado
    const selectedTeam = shuffled.slice(0, 5);
    setRandomTeam(selectedTeam);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Player</Text>
        <Text style={styles.title}>Times Pokemon</Text>
        <Text style={styles.subtitle}>Monte e acompanhe as equipes principais do jogador.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- Seção do time aleatório via api --- */}
        <View style={[styles.card, styles.randomCard]}>
          {/* --- Andrei: André, fazer --- */}
          <Text style={[styles.cardTitle, styles.randomTitle]}>Seu Time Aleatório</Text>

          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary_blue} style={{ marginVertical: 10 }} />
          ) : (
            <View style={styles.memberGrid}>
              {randomTeam.map((pokemon) => (
                <View key={`random-${pokemon.id}`} style={[styles.memberBadge, styles.randomBadge]}>
                  {/* 2. EXIBIÇÃO DA IMAGEM: Passamos a URL da API no 'uri' */}
                  {pokemon.imagem && (
                    <Image 
                      source={{ uri: pokemon.imagem }} 
                      style={styles.pokemonImage} 
                    />
                  )}
                  <Text style={styles.pokemonName}>
                    {pokemon.nome.charAt(0).toUpperCase() + pokemon.nome.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Button 
            title="Sortear Novo Time" 
            onPress={() => generateRandomTeam(allPokemon)} 
            style={styles.rerollButton}
            disabled={loading}
          />
        </View>

        <Button title="Ver perfil" onPress={() => router.push('/profile')} style={styles.button} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
    backgroundColor: Colors.dark_red,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  eyebrow: {
    color: Colors.light_purple,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    marginBottom: 6,
  },
  title: {
    color: Colors.soft_purple,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.soft_purple_muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  content: {
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
  randomCard: {
    borderColor: Colors.primary_blue,
    borderWidth: 1.5,
  },
  randomTitle: {
    color: Colors.dark_red,
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
    color: Colors.soft_purple,
    backgroundColor: Colors.primary_blue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  randomBadge: {
    backgroundColor: Colors.dark_red,
    color: Colors.white,
  },
  button: {
    marginTop: 12,
  },
  rerollButton: {
    marginTop: 16,
    backgroundColor: Colors.primary_blue,
  }
});