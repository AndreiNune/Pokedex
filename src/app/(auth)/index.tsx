import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@/component/button';
import Input from '@/component/input';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signIn } = useAuth();

  async function validateCredentials() {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o usuário e a senha.');
      return;
    }

    setIsLoading(true);
    const success = await signIn(usuario, senha);

    if (success) {
      router.push('/pokedex');
      return;
    }

    setIsLoading(false);
    Alert.alert('Acesso negado', 'Usuário ou senha incorretos. Tente novamente.');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>Treinador</Text>
          <Text style={styles.title}>Pokédex</Text>
          <Text style={styles.subtitle}>Entre para acessar seu perfil, sua Pokédex e seus times.</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Login</Text>

          <Input
            placeholder="Usuário"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            style={styles.inputSpacing}
          />

          <Input
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.passwordSpacing}
          />

          <Button
            title={isLoading ? 'Entrando...' : 'Entrar'}
            onPress={validateCredentials}
            disabled={isLoading}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.auth_background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
    backgroundColor: Colors.black,
    borderBottomColor: Colors.neon_red,
    borderBottomWidth: 1,
  },
  headerContent: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  eyebrow: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontFamily: Colors.font_pixel,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.text_muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  loginTitle: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputSpacing: {
    marginBottom: 16,
  },
  passwordSpacing: {
    marginBottom: 24,
  },
  registerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: Colors.text_muted,
    fontSize: 14,
  },
  registerLink: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 14,
    fontWeight: '800',
  },
});
