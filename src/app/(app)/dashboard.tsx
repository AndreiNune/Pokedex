import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import Navbar from '@/component/navbar';
import { Colors } from '@/constants/colors';

export default function Dashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar
        eyebrow="Inicio"
        title="Dashboard"
        subtitle="Acesse rapidamente as areas principais."
      />

      <View style={styles.content}>
        <View style={styles.panel}>
          <Text style={styles.title}>Bem-vindo ao Dashboard!</Text>
          <Button title="Abrir perfil" onPress={() => router.push('/profile')} style={styles.button} />
          <Button title="Meus times" onPress={() => router.push('/teams')} style={styles.button} />
          <Button title="Box Pokemon" onPress={() => router.push('/box')} style={styles.button} />
          <Button title="Batalha" onPress={() => router.push('/battle')} style={styles.button} />
          <Button title="Pokedex" onPress={() => router.push('/pokedex')} style={styles.button} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dashboard_background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary_blue,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
});
