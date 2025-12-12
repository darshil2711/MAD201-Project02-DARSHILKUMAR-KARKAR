/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: Displays a list of all recorded transactions with options to delete them.
*/

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Transaction List Screen - Displays history of all transactions.
 */
const TransactionListScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isDark, setIsDark] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const data = await AsyncStorage.getItem('transactions');
        const curr = await AsyncStorage.getItem('currency');
        const theme = await AsyncStorage.getItem('theme');
        
        if (data) setTransactions(JSON.parse(data));
        
        if (curr === 'EUR') setCurrencySymbol('€');
        else if (curr === 'GBP') setCurrencySymbol('£');
        else setCurrencySymbol('$');
        setIsDark(theme === 'dark');
      };
      load();
    }, [])
  );

  /**
   * Deletes a transaction by ID and updates storage.
   * @param {string} id - The ID of the transaction to delete.
   */
  const handleDelete = async (id) => {
    const filtered = transactions.filter(t => t.id !== id);
    setTransactions(filtered);
    await AsyncStorage.setItem('transactions', JSON.stringify(filtered));
  };

  /**
   * Renders a single transaction item for the FlatList.
   */
  const renderItem = ({ item }) => {
    const iconBgColor = isDark 
      ? (item.type === 'income' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)')
      : (item.type === 'income' ? '#E8F5E9' : '#FFEBEE');

    return (
    <View style={[styles.item, isDark && styles.darkItem]}>
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        <Ionicons name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} size={24} color={item.type === 'income' ? '#4CAF50' : '#F44336'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemTitle, isDark && styles.darkText]}>{item.title}</Text>
        <Text style={[styles.itemCategory, isDark && styles.darkSubText]}>{item.category}</Text>
        <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.itemAmount, { color: item.type === 'income' ? '#4CAF50' : '#F44336' }]}>
          {item.type === 'income' ? '+' : '-'}{currencySymbol}{parseFloat(item.amount).toFixed(2)}
        </Text>
        <TouchableOpacity 
          onPress={() => Alert.alert('Delete', 'Are you sure?', [
            { text: 'Cancel' },
            { text: 'Delete', onPress: () => handleDelete(item.id), style: 'destructive' }
          ])}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  )};

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.header, isDark && styles.darkText]}>All Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={[styles.emptyText, isDark && styles.darkSubText]}>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={isDark}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  darkText: { color: '#fff' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  darkItem: { backgroundColor: '#1e1e1e' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemCategory: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  darkSubText: { color: '#aaa' },
  itemDate: { fontSize: 12, color: '#999' },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  deleteButton: { marginTop: 5, padding: 5 },
});

export default TransactionListScreen;