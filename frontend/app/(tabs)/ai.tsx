import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function AIScreen() {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.text,
    },
    subtext: {
      fontSize: 16,
      color: colors.icon,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI Chat Screen</Text>
      <Text style={styles.subtext}>This is where you will chat with the Claude AI assistant.</Text>
    </View>
  );
} 