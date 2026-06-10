import React from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  FlatList,
  Image,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { Pokemon } from '@/@types/pokemon';
import { Colors } from '@/constants/colors';
import styles from './style';

type ListaProps = {
  pokemons: Pokemon[];
  loading?: boolean;
  erro?: string;
  columns?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Lista({
  pokemons,
  loading = false,
  erro = '',
  columns = 2,
  style,
}: ListaProps) {
  const normalizedColumns = Math.max(1, Math.min(columns, 3));
  const itemWidth: DimensionValue = `${100 / normalizedColumns}%`;

  if (loading) {
    return (
      <View style={[styles.centerState, style]}>
        <ActivityIndicator size="large" color={Colors.light_purple} />
        <Text style={styles.stateText}>Carregando pokemons...</Text>
      </View>
    );
  }

  if (erro.length > 0) {
    return (
      <View style={[styles.centerState, style]}>
        <Text style={styles.errorText}>{erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={normalizedColumns}
      data={pokemons}
      keyExtractor={(item) => item.index}
      numColumns={normalizedColumns}
      contentContainerStyle={[styles.listContent, style]}
      columnWrapperStyle={normalizedColumns > 1 ? styles.columnWrapper : undefined}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const principaisPoderes = item.poderes.slice(0, 3);

        return (
          <View style={[styles.itemWrapper, { width: itemWidth }]}>
            <View style={styles.card}>
              <View style={styles.imagePanel}>
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
                <Text style={styles.index}>#{item.index}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.nome}</Text>

                <View style={styles.typeRow}>
                  {item.tipos.map((tipo) => (
                    <Text key={`${item.index}-${tipo}`} style={styles.typeBadge}>
                      {tipo}
                    </Text>
                  ))}
                </View>

                <View style={styles.stats}>
                  {principaisPoderes.map((poder) => (
                    <View key={`${item.index}-${poder.nome}`} style={styles.statLine}>
                      <Text style={styles.statName}>{poder.nome}</Text>
                      <Text style={styles.statValue}>{poder.forca}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}
