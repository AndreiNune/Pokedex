import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import { Colors } from '@/constants/colors';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard!</Text>
      <Button title="Abrir perfil" onPress={() => router.push('/profile')} style={styles.button} />
      <Button title="Meus times" onPress={() => router.push('/teams')} style={styles.button} />
      <Button title="Pokedex" onPress={() => router.push('/pokedex')} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dashboard_background,
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
