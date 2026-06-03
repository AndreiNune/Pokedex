import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  columnWrapper: {
    alignItems: 'stretch',
  },
  itemWrapper: {
    padding: 6,
  },
  card: {
    minHeight: 260,
    backgroundColor: 'rgba(76, 29, 149, 0.72)',
    borderColor: 'rgba(216, 180, 254, 0.22)',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePanel: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    paddingVertical: 10,
  },
  pokemonImage: {
    width: 92,
    height: 92,
  },
  index: {
    color: '#e9d5ff',
    fontSize: 13,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    color: '#f5edff',
    backgroundColor: 'rgba(192, 132, 252, 0.28)',
    borderColor: 'rgba(233, 213, 255, 0.28)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  stats: {
    gap: 6,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statName: {
    flex: 1,
    color: 'rgba(245, 237, 255, 0.78)',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statValue: {
    color: '#f5edff',
    fontSize: 12,
    fontWeight: '800',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: '#f5edff',
    fontSize: 15,
    marginTop: 12,
  },
  errorText: {
    color: '#fecdd3',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
