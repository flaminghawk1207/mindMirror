import { View, type ViewProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { theme, colors } = useTheme();
  const backgroundColor = lightColor && darkColor ? (theme === 'dark' ? darkColor : lightColor) : colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
