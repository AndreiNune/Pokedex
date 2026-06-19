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
            <Text style={styles.menuText}>Pokédex</Text>
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
            <Text style={styles.menuText}>Ver perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/teams');
            }}
          >
            <Text style={styles.menuText}>Ver meus times</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push('/box');
            }}
          >
            <Text style={styles.menuText}>Box Pokémon</Text>
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
    backgroundColor: Colors.black,
  },
  navbar: {
    backgroundColor: Colors.black,
    borderBottomColor: Colors.neon_red,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: Colors.neon_shadow_red,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
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
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontFamily: Colors.font_pixel,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.text_muted,
    fontSize: 14,
    marginTop: 6,
  },
  menuButton: {
    width: 44,
    height: 44,
    padding: 8,
    justifyContent: 'center',
    gap: 5,
    borderColor: Colors.neon_blue,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  menuLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.neon_blue,
  },
  menu: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.neon_blue,
    borderWidth: 1,
    borderTopWidth: 0,
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
    color: Colors.text,
    fontFamily: Colors.font_pixel,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: Colors.danger,
    fontFamily: Colors.font_pixel,
    fontSize: 16,
    fontWeight: '700',
  },
});
