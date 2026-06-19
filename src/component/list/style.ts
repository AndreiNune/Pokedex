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
    backgroundColor: Colors.surface,
    borderColor: Colors.input_border,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.neon_shadow_blue,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  cardHover: {
    borderColor: Colors.neon_blue,
    shadowColor: Colors.neon_shadow_blue,
    shadowOpacity: 0.95,
    shadowRadius: 16,
    transform: [{ translateY: -3 }, { scale: 1.03 }],
  },
  cardPressed: {
    borderColor: Colors.neon_red,
    transform: [{ translateY: 1 }, { scale: 0.98 }],
  },
  imagePanel: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface_elevated,
    borderBottomColor: Colors.input_border,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  pokemonImage: {
    width: 92,
    height: 92,
  },
  index: {
    color: Colors.neon_blue,
    fontFamily: Colors.font_pixel,
    fontSize: 13,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  name: {
    color: Colors.white,
    fontFamily: Colors.font_pixel,
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
    fontFamily: Colors.font_pixel,
    fontSize: 15,
    marginTop: 12,
  },
  errorText: {
    color: Colors.soft_error,
    fontFamily: Colors.font_pixel,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default styles;
