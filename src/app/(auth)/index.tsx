import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  Pressable,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

import Button from '@/component/button';
import Input from '@/component/input';

export default function Index() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [hover, setHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { signIn } = useAuth();
    const { signOut } = useAuth();

    function validateCredentials() {
        if (!usuario.trim() || !senha.trim()) {
            setAlertData({
                title: 'Campos obrigatórios',
                message: 'Por favor, preencha o nome e a senha.',
                type: 'warning',
            });
            console.log(`title: 'Campos obrigatórios',
                message: 'Por favor, preencha o nome e a senha.',
                type: 'warning',`);
            setIsAlertVisible(true);
            return;
        }

        const success = signIn(usuario, senha);

        if (success) {
          console.log("Entrou");
            setIsLoading(true);
            setTimeout(() => {
                router.push('/pokedex');
            }, 5000);
        } else {
          console.log("não entrou");
            setAlertData({
                title: 'Acesso negado',
                message: 'Nome ou senha incorretos. Tente novamente.',
                type: 'error',
            });
            console.log(`title: 'Acesso negado',
                message: 'Nome ou senha incorretos. Tente novamente.',
                type: 'error',`);
            setIsAlertVisible(true);
            return signOut();
        }
    }

  const handleLogin = () => {
    console.log(
      'Usuário:',
      usuario,
      '| Senha:',
      senha
    );

    if (
      usuario.trim() === 'Neyma' &&
      senha.trim() === 'vaiBrasil'
    ) {

    } else {

      Alert.alert(
        'Erro',
        'Usuário ou senha incorretos.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pokedex
      </Text>

      <Pressable
        style={styles.neymarContainer}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
      >
        <Image
          source={
            hover
              ? require('@assets/images/neymar-aberto.png')
              : require('@assets/images/neymar-aberto.png')
          }
          style={styles.neymarImage}
          resizeMode="contain"
        />

        {hover && (
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>
              Login
            </Text>

            <Input
              placeholder="Usuário"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              style={{
                marginBottom: 16,
              }}
            />

            <Input
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              style={{
                marginBottom: 24,
              }}
            />

            <Button
              title="Entrar"
              onPress={validateCredentials}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  neymarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  neymarImage: {
    width: 350,
    height: 350,
  },

  loginCard: {
    position: 'absolute',
    bottom: 40,

    width: 280,

    backgroundColor: 'rgba(255,255,255,0.95)',

    borderRadius: 20,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#150b80',
  },
});
