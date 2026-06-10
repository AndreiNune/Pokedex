import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

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
    backgroundColor: Colors.dark_blue,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePanel: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 10,
  },
  pokemonImage: {
    width: 92,
    height: 92,
  },
  index: {
    color: Colors.pale_purple,
    fontSize: 13,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  name: {
    color: Colors.white,
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
    color: Colors.soft_purple,
    backgroundColor: Colors.badge_purple_background,
    borderColor: Colors.badge_purple_border,
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
    color: Colors.soft_purple_muted,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statValue: {
    color: Colors.soft_purple,
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
    color: Colors.soft_purple,
    fontSize: 15,
    marginTop: 12,
  },
  errorText: {
    color: Colors.soft_error,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
