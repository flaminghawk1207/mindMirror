import { View, Text, StyleSheet } from 'react-native';

export default function TrendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trends Screen</Text>
      <Text style={styles.subtext}>This is where you will see your mental status trends and graphs.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});
