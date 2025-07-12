import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    subtitle: {
      fontSize: 18,
      color: colors.icon,
      marginBottom: 32,
    },
    button: {
      backgroundColor: colors.tint,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>mindMirror</Text>
      <Text style={styles.subtitle}>Welcome to mindMirror!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
