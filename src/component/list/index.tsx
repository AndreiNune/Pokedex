import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { getPokemon } from '@/integration/pokemonIntegration';
import styles from './style';

export default function Lista() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await getPokemon();
        setPokemons(dados);
      } catch (error) {
        console.error("Erro ao carregar a lista de Pokémon:", error);
      }
    }
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.index} // Usa o 'index' (ex: "001") como chave única
        renderItem={({ item }) => (
          <View style={styles.itemCartao}>
            <Image 
              source={{ uri: item.imagem }} 
              style={styles.imagemPokemon} 
            />
            <View style={styles.infoContainer}>
              <Text style={styles.nome}>#{item.index} - {item.nome}</Text>
              <Text style={styles.detalhe}>
                Tipos: {item.tipos.join(', ')}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
