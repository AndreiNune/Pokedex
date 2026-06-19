import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

type NavbarProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function Navbar({
  eyebrow,
  title,
  subtitle,
}: NavbarProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>

            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            style={styles.menuButton}
            accessibilityLabel="Abrir menu"
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/pokedex');
            }}
          >
            <Text style={styles.menuText}>Pokedex</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/dashboard');
            }}
          >
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/profile');
            }}
          >
            <Text style={styles.menuText}>Ver Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/teams');
            }}
          >
            <Text style={styles.menuText}>Ver Meus Times</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/box');
            }}
          >
            <Text style={styles.menuText}>Box Pokemon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/battle');
            }}
          >
            <Text style={styles.menuText}>Batalha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              handleSignOut();
            }}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.dark_red,
  },
  navbar: {
    backgroundColor: Colors.dark_red,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  navbarContent: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  eyebrow: {
    color: Colors.light_purple,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: Colors.soft_purple,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.soft_purple_muted,
    fontSize: 14,
    marginTop: 6,
  },
  menuButton: {
    width: 44,
    height: 44,
    padding: 8,
    justifyContent: 'center',
    gap: 5,
  },
  menuLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  menu: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_border,
  },
  menuText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
});
