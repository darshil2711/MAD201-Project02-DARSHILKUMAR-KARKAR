/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: The main dashboard displaying the current balance, income, expense totals, and navigation buttons.
*/

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFinancialSummary } from './api'; // Import API

/**
 * Home Screen Component - Displays the dashboard with financial summaries.
 */
const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState({ income: 0, expense: 0, balance: 0 });
  const [isDark, setIsDark] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useFocusEffect(
    useCallback(() => {
      /**
       * Loads financial data and settings (theme/currency) from storage.
       */
      const loadData = async () => {
        const theme = await AsyncStorage.getItem('theme');
        const curr = await AsyncStorage.getItem('currency');
        const result = await getFinancialSummary();
        
        setIsDark(theme === 'dark');
        if (curr === 'EUR') setCurrencySymbol('€');
        else if (curr === 'GBP') setCurrencySymbol('£');
        else setCurrencySymbol('$');
        setData(result);
      };
      loadData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isDark && styles.darkText]}>Welcome Back!</Text>
        <Text style={[styles.subGreeting, isDark && styles.darkSubText]}>Here is your budget summary</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Total Balance</Text>
          <Ionicons name="wallet-outline" size={24} color="rgba(255,255,255,0.8)" />
        </View>
        <Text style={styles.balanceText}>{currencySymbol}{data.balance.toFixed(2)}</Text>
        <View style={styles.row}>
          <View style={styles.statColumn}>
            <Text style={styles.incomeLabel}><Ionicons name="arrow-down" size={12} /> Income</Text>
            <Text style={styles.incomeValue}>+{currencySymbol}{data.income.toFixed(2)}</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.expenseLabel}><Ionicons name="arrow-up" size={12} /> Expense</Text>
            <Text style={styles.expenseValue}>-{currencySymbol}{data.expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.btnIcon} />
          <Text style={styles.primaryButtonText}>Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton, isDark && styles.darkSecondaryButton]} 
          onPress={() => navigation.navigate('TransactionList')}
        >
          <Ionicons name="list-outline" size={24} color={isDark ? '#fff' : '#333'} style={styles.btnIcon} />
          <Text style={[styles.secondaryButtonText, isDark && styles.darkSecondaryButtonText]}>View All History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton, isDark && styles.darkSecondaryButton]} 
          onPress={() => navigation.navigate('Reports')}
        >
          <Ionicons name="pie-chart-outline" size={24} color={isDark ? '#fff' : '#333'} style={styles.btnIcon} />
          <Text style={[styles.secondaryButtonText, isDark && styles.darkSecondaryButtonText]}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },
  header: { marginBottom: 20, marginTop: 10 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  darkText: { color: '#fff' },
  subGreeting: { fontSize: 16, color: '#666' },
  darkSubText: { color: '#aaa' },
  card: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: '#e8f5e9', fontSize: 14 },
  balanceText: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statColumn: { flex: 1 },
  incomeLabel: { color: '#e8f5e9', fontSize: 12 },
  incomeValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  expenseLabel: { color: '#ffcdd2', fontSize: 12 },
  expenseValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonContainer: { gap: 15 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  primaryButton: { backgroundColor: '#333', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnIcon: { marginRight: 10 },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  secondaryButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  darkSecondaryButton: { backgroundColor: '#333', borderColor: '#555' },
  darkSecondaryButtonText: { color: '#fff' },
});

export default HomeScreen;