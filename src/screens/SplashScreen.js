/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: The initial screen shown when the app launches, simulating a loading process before navigating to Home.
*/

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/**
 * Splash Screen - Initial loading screen before navigating to Home.
 */
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate loading data, then navigate to Home
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Ionicons name="wallet" size={80} color="#4CAF50" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>SmartBudgetTracker</Text>
      <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SplashScreen;