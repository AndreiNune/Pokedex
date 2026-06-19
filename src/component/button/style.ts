import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const Styles = StyleSheet.create({
  button: {
        width: '100%',
        minHeight: 52,
        backgroundColor: Colors.surface_elevated,
        borderColor: Colors.neon_blue,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.neon_shadow_blue,
        shadowOpacity: 0.9,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
        paddingHorizontal: 14,
        transform: [{ scale: 1 }],
    },
    buttonHover: {
        backgroundColor: Colors.primary_blue,
        borderColor: Colors.neon_blue,
        transform: [{ translateY: -2 }, { scale: 1.02 }],
    },
    buttonPressed: {
        backgroundColor: Colors.dark_red,
        borderColor: Colors.neon_red,
        transform: [{ translateY: 1 }, { scale: 0.98 }],
    },
    buttonDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
    },
    title: {
        color: Colors.white,
        fontFamily: Colors.font_pixel,
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
        textTransform: 'uppercase',
    }
});
