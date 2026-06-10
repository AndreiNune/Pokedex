import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Treinador</Text>
        <Text style={styles.title}>{user || 'Player'}</Text>
        <Text style={styles.subtitle}>Perfil do jogador conectado.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user || 'P').charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user || 'Player'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Classe</Text>
          <Text style={styles.value}>Treinador Pokemon</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>Online</Text>
        </View>

        <Button title="Ver meus times" onPress={() => router.push('/teams')} style={styles.button} />
        <Button title="Voltar para Pokedex" onPress={() => router.push('/pokedex')} style={styles.button} />
        <Button title="Sair" onPress={handleSignOut} style={styles.button} />
      </View>
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
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary_blue,
    marginBottom: 20,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: '800',
  },
  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: Colors.gray,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    marginTop: 12,
  },
});
