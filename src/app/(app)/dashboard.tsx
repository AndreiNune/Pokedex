import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Button from '@/component/button';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Dashboard!</Text>
      <Button title="Botão Ação" onPress={() => {}} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#150b80',
    marginBottom: 12,
    textAlign: 'center',
  },
});
