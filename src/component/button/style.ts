import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const Styles = StyleSheet.create({
  button: {
        width: '100%',
        height: 52,
        backgroundColor: Colors.primary_blue,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',   
    },
    title: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
