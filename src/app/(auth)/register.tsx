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
import { register } from '@/integration/authIntegration';

export default function Register() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleRegister() {
    if (!usuario.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha usuário, senha e confirmação.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senha inválida', 'A senha e a confirmação precisam ser iguais.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        username: usuario.trim(),
        password: senha,
      });

      Alert.alert('Cadastro concluído', 'Agora você pode entrar com sua conta.');
      router.replace('/');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro no cadastro', 'Não foi possível cadastrar este usuário.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow}>Novo treinador</Text>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta para salvar perfil e times Pokémon.</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar conta</Text>

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
            style={styles.inputSpacing}
          />

          <Input
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            style={styles.passwordSpacing}
          />

          <Button
            title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
            onPress={handleRegister}
            disabled={isLoading}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Text style={styles.loginLink}>Entrar</Text>
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
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  cardTitle: {
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
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: Colors.text_muted,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 14,
    fontWeight: '800',
  },
});
