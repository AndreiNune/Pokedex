import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import { Colors } from '@/constants/colors';

const pokemonTeams = [
  {
    name: 'Time Kanto',
    description: 'Equipe equilibrada para batalhas classicas.',
    members: ['Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Snorlax', 'Gengar'],
  },
  {
    name: 'Time Velocidade',
    description: 'Foco em ataque rapido e vantagem de turno.',
    members: ['Jolteon', 'Aerodactyl', 'Alakazam', 'Dugtrio', 'Persian', 'Starmie'],
  },
  {
    name: 'Time Defesa',
    description: 'Formacao resistente para segurar lutas longas.',
    members: ['Lapras', 'Onix', 'Slowbro', 'Chansey', 'Vaporeon', 'Dragonite'],
  },
];

export default function Teams() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Player</Text>
        <Text style={styles.title}>Times Pokemon</Text>
        <Text style={styles.subtitle}>Monte e acompanhe as equipes principais do jogador.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pokemonTeams.map((team) => (
          <View key={team.name} style={styles.card}>
            <Text style={styles.cardTitle}>{team.name}</Text>
            <Text style={styles.cardDescription}>{team.description}</Text>

            <View style={styles.memberGrid}>
              {team.members.map((member) => (
                <Text key={`${team.name}-${member}`} style={styles.memberBadge}>
                  {member}
                </Text>
              ))}
            </View>
          </View>
        ))}

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
  button: {
    marginTop: 12,
  },
});
