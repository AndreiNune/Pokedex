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

  function handleSignOut() {
    signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView>
      <View style={styles.navbar}>
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
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
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
  navbar: {
    backgroundColor: Colors.dark_red,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    padding: 8,
  },

  menuIcon: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },

  menu: {
    backgroundColor: Colors.white,
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
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '700',
  },
});