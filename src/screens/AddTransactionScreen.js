/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: A form screen to allow users to input new income or expense transactions with categories.
*/

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { postTransaction } from './api'; // Import API

/**
 * Add Transaction Screen - Form to input new financial records.
 */
const AddTransactionScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const theme = await AsyncStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };
    loadTheme();
  }, []);

  /**
   * Validates input and saves the transaction to storage.
   */
  const handleAdd = async () => {
    if (!title || !amount || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid numeric amount');
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString(),
    };

    const success = await postTransaction(newTransaction);
    
    if (success) {
      Alert.alert('Success', 'Transaction Added!');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.header, isDark && styles.darkText]}>Add Transaction</Text>

      <Text style={[styles.label, isDark && styles.darkText]}>Title</Text>
      <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
        <Ionicons name="create-outline" size={20} color={isDark ? '#aaa' : '#666'} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, isDark && styles.darkInput]} 
          placeholder="e.g., Grocery, Salary" 
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <Text style={[styles.label, isDark && styles.darkText]}>Category</Text>
      <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
        <Ionicons name="grid-outline" size={20} color={isDark ? '#aaa' : '#666'} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, isDark && styles.darkInput]} 
          placeholder="e.g., Food, Transport" 
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <Text style={[styles.label, isDark && styles.darkText]}>Amount ($)</Text>
      <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
        <Ionicons name="cash-outline" size={20} color={isDark ? '#aaa' : '#666'} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, isDark && styles.darkInput]} 
          placeholder="0.00" 
          placeholderTextColor={isDark ? '#888' : '#999'}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <Text style={[styles.label, isDark && styles.darkText]}>Type</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity 
          style={[styles.typeButton, isDark && styles.darkTypeButton, type === 'income' && styles.selectedTypeIncome]} 
          onPress={() => setType('income')}
        >
          <Ionicons name="arrow-down-circle-outline" size={20} color={type === 'income' ? '#fff' : '#333'} style={{marginRight: 5}} />
          <Text style={[styles.typeText, type === 'income' && styles.selectedText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeButton, isDark && styles.darkTypeButton, type === 'expense' && styles.selectedTypeExpense]} 
          onPress={() => setType('expense')}
        >
          <Ionicons name="arrow-up-circle-outline" size={20} color={type === 'expense' ? '#fff' : '#333'} style={{marginRight: 5}} />
          <Text style={[styles.typeText, type === 'expense' && styles.selectedText]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  darkContainer: { backgroundColor: '#121212' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  darkText: { color: '#fff' },
  label: { fontSize: 16, color: '#666', marginBottom: 5 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  darkInputContainer: { backgroundColor: '#1e1e1e', borderColor: '#333' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  darkInput: { color: '#fff' },
  typeContainer: { flexDirection: 'row', marginBottom: 30 },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5, 
  },
  darkTypeButton: { borderColor: '#333', backgroundColor: '#1e1e1e' },
  selectedTypeIncome: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  selectedTypeExpense: { backgroundColor: '#F44336', borderColor: '#F44336' },
  typeText: { fontSize: 16, color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AddTransactionScreen;