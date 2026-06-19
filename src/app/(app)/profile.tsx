import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import Navbar from '@/component/navbar';

import { ProfileStats } from '@/@types/auth';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getProfileStats } from '@/integration/authIntegration';

export default function Profile() {
  const { user, userId } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    async function loadStats() {
      if (!userId) return;

      try {
        setLoadingStats(true);
        const profileStats = await getProfileStats(userId);
        setStats(profileStats);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [userId]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Navbar
          eyebrow="Treinador"
          title={user || 'Player'}
          subtitle="Perfil do jogador conectado."
        />

        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user || 'P').charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user || 'Player'}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>Online</Text>
          </View>

          {loadingStats ? (
            <ActivityIndicator size="small" color={Colors.primary_blue} />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.label}>Level</Text>
                <Text style={styles.value}>{stats?.level || '0'}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.label}>Vitórias</Text>
                <Text style={styles.value}>{stats?.vitorias || '0'}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.label}>Derrotas</Text>
                <Text style={styles.value}>{stats?.derrotas || '0'}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dashboard_background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface_elevated,
    borderColor: Colors.neon_blue,
    borderWidth: 1,
    shadowColor: Colors.neon_shadow_blue,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 20,
  },
  avatarText: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 40,
    fontWeight: '800',
  },
  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: Colors.text_muted,
    fontFamily: Colors.font_pixel,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  statsGrid: {
    width: '100%',
    gap: 12,
  },
  statBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    padding: 16,
  },
});
