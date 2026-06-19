import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const Styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    fontFamily: Colors.font_pixel,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 12,
  }
});
