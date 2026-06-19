import { Pressable, PressableProps, Text, StyleProp, ViewStyle } from "react-native"

import {Styles} from './style'

type ButtonProps = PressableProps & {
  title: string;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ title, style, ...rest }: ButtonProps) {
  return (
    <Pressable
      style={({ hovered, pressed }: { hovered?: boolean; pressed: boolean }) => [
        Styles.button,
        hovered && Styles.buttonHover,
        pressed && Styles.buttonPressed,
        rest.disabled && Styles.buttonDisabled,
        style,
      ]}
      {...rest}
    >
      <Text style={Styles.title}>{title}</Text>
    </Pressable>
  );
}
