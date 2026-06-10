import { TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native"

import { Styles } from './style'
import { Colors } from '@/constants/colors';

type InputProps = TextInputProps & {
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
}

export default function Input({ placeholder = "Digite algo...", style, ...rest }: InputProps) {
  return (
    <TextInput 
      style={[Styles.input, style]} 
      placeholder={placeholder}
      placeholderTextColor={Colors.input_placeholder}
      {...rest} 
    />
  );
}
