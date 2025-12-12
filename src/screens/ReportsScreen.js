/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: Displays financial reports including total income, expenses, balance, and a breakdown by category.
*/

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getFinancialSummary } from './api'; // Import API

/**
 * Reports Screen - Displays detailed financial breakdown and category summaries.
 */
const ReportsScreen = () => {
  const [data, setData] = useState({ income: 0, expense: 0, balance: 0, history: [] });
  const [isDark, setIsDark] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [categorySummary, setCategorySummary] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const theme = await AsyncStorage.getItem('theme');
        const curr = await AsyncStorage.getItem('currency');
        const result = await getFinancialSummary();
        
        setIsDark(theme === 'dark');
        if (curr === 'EUR') setCurrencySymbol('€');
        else if (curr === 'GBP') setCurrencySymbol('£');
        else setCurrencySymbol('$');

        // Calculate Category Summary
        const categories = {};
        result.history.forEach(t => {
          if (t.type === 'expense') {
            const cat = t.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + parseFloat(t.amount);
          }
        });
        setCategorySummary(categories);
        setData(result);
      };
      load();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.header, isDark && styles.darkText]}>Financial Report</Text>
      
      <View style={styles.gridContainer}>
        <View style={[styles.box, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="arrow-down-circle" size={24} color="#fff" style={{marginBottom: 5}} />
          <Text style={styles.boxLabel}>Income</Text>
          <Text style={styles.boxValue}>{currencySymbol}{data.income.toFixed(2)}</Text>
        </View>

        <View style={[styles.box, { backgroundColor: '#F44336' }]}>
          <Ionicons name="arrow-up-circle" size={24} color="#fff" style={{marginBottom: 5}} />
          <Text style={styles.boxLabel}>Expense</Text>
          <Text style={styles.boxValue}>{currencySymbol}{data.expense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={[styles.summaryBox, isDark && styles.darkSummaryBox]}>
        <Text style={styles.summaryLabel}>Net Savings</Text>
        <Text style={[styles.summaryValue, { color: data.balance >= 0 ? '#4CAF50' : '#F44336' }]}>
          {currencySymbol}{data.balance.toFixed(2)}
        </Text>
      </View>

      <Text style={[styles.subHeader, isDark && styles.darkText]}>Expenses by Category</Text>
      {Object.keys(categorySummary).length === 0 ? (
        <Text style={[styles.emptyText, isDark && styles.darkSubText]}>No expenses to show.</Text>
      ) : (
        Object.entries(categorySummary).map(([cat, amount]) => (
          <View key={cat} style={[styles.categoryRow, isDark && styles.darkCategoryRow]}>
            <Text style={[styles.categoryText, isDark && styles.darkSubText]}>{cat}</Text>
            <Text style={[styles.categoryAmount, isDark && styles.darkText]}>{currencySymbol}{amount.toFixed(2)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  darkContainer: { backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  darkText: { color: '#fff' },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 10 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  box: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxLabel: { color: '#fff', fontSize: 16, marginBottom: 5 },
  boxValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  summaryBox: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkSummaryBox: { borderColor: '#333', backgroundColor: '#1e1e1e' },
  summaryLabel: { fontSize: 18, color: '#333' },
  summaryValue: { fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkCategoryRow: { borderBottomColor: '#333' },
  categoryText: { fontSize: 16, color: '#555' },
  darkSubText: { color: '#aaa' },
  categoryAmount: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  emptyText: { color: '#999', fontStyle: 'italic' },
});

export default ReportsScreen;