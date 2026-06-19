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
      Alert.alert('Campos obrigatorios', 'Preencha usuario, senha e confirmacao.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senha invalida', 'A senha e a confirmacao precisam ser iguais.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        username: usuario.trim(),
        password: senha,
      });

      Alert.alert('Cadastro concluido', 'Agora voce pode entrar com sua conta.');
      router.replace('/');
    } catch (error) {
      console.error('Erro ao cadastrar usuario:', error);
      Alert.alert('Erro no cadastro', 'Nao foi possivel cadastrar este usuario.');
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
          <Text style={styles.subtitle}>Crie sua conta para salvar perfil e times Pokemon.</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar conta</Text>

          <Input
            placeholder="Usuario"
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
            <Text style={styles.loginText}>Ja tem conta?</Text>
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
  headerContent: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  eyebrow: {
    color: Colors.light_purple,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 6,
    textTransform: 'uppercase',
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.white,
    borderColor: Colors.input_border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  cardTitle: {
    color: Colors.primary_blue,
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
    color: Colors.gray,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary_blue,
    fontSize: 14,
    fontWeight: '800',
  },
});
