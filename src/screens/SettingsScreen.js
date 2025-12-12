/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: Allows users to configure app settings like Dark Mode and Currency, and view live exchange rates.
*/

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

/**
 * Settings Screen - Manages app preferences (Theme, Currency) and fetches API rates.
 */
const SettingsScreen = () => {
  const [isDark, setIsDark] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    fetchRates();
  }, []);

  /**
   * Loads saved preferences from AsyncStorage.
   */
  const loadSettings = async () => {
    const theme = await AsyncStorage.getItem('theme');
    const curr = await AsyncStorage.getItem('currency');
    if (theme === 'dark') setIsDark(true);
    if (curr) setCurrency(curr);
  };

  /**
   * Fetches live currency rates from the API.
   */
  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setRates(data.rates);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggles Dark Mode and saves preference.
   * @param {boolean} value - True for dark mode, false for light.
   */
  const toggleTheme = async (value) => {
    setIsDark(value);
    await AsyncStorage.setItem('theme', value ? 'dark' : 'light');
  };

  /**
   * Updates the selected currency.
   * @param {string} curr - The currency code (e.g., 'USD', 'EUR').
   */
  const changeCurrency = async (curr) => {
    setCurrency(curr);
    await AsyncStorage.setItem('currency', curr);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.header, isDark && styles.darkText]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Appearance</Text>
        <View style={styles.row}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="moon-outline" size={22} color={isDark ? '#fff' : '#333'} style={{marginRight: 10}} />
            <Text style={[styles.label, isDark && styles.darkText]}>Dark Mode</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Currency</Text>
        <View style={styles.currencyContainer}>
          {['USD', 'EUR', 'GBP'].map((curr) => (
            <TouchableOpacity
              key={curr}
              style={[
                styles.currencyButton, 
                isDark && styles.darkCurrencyButton,
                currency === curr && styles.selectedCurrency
              ]}
              onPress={() => changeCurrency(curr)}
            >
              <Text style={[styles.currencyText, isDark && styles.darkText, currency === curr && styles.selectedCurrencyText]}>{curr}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Live Exchange Rates (Base: USD)</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : rates ? (
          <View>
            <Text style={[styles.rateText, isDark && styles.darkText]}>EUR: {rates.EUR}</Text>
            <Text style={[styles.rateText, isDark && styles.darkText]}>GBP: {rates.GBP}</Text>
            <Text style={[styles.rateText, isDark && styles.darkText]}>CAD: {rates.CAD}</Text>
            <Text style={[styles.rateText, isDark && styles.darkText]}>JPY: {rates.JPY}</Text>
          </View>
        ) : (
          <Text style={[styles.errorText, isDark && styles.darkText]}>Failed to load rates</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  darkContainer: { backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  darkText: { color: '#fff' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, color: '#666' },
  currencyContainer: { flexDirection: 'row', gap: 10 },
  currencyButton: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  darkCurrencyButton: { borderColor: '#333', backgroundColor: '#1e1e1e' },
  selectedCurrency: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  currencyText: { color: '#333' },
  selectedCurrencyText: { color: '#fff', fontWeight: 'bold' },
  rateText: { fontSize: 16, marginBottom: 5, color: '#666' },
  errorText: { color: 'red' },
});

export default SettingsScreen;