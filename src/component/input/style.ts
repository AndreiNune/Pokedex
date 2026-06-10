import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const Styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: Colors.input_border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
  }
});
