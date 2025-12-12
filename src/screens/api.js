/*
  Course: MAD201
  Project: Project 02
  Student: Darshilkumar Karkar (A00203357)
  Description: Handles local storage operations using AsyncStorage for transactions and calculates financial summaries.
*/

import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTION_KEY = 'transactions';

/**
 * Fetches all transactions from local AsyncStorage.
 * @returns {Promise<Array>} List of transaction objects.
 */
export const fetchTransactions = async () => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

/**
 * Saves a new transaction to AsyncStorage.
 * @param {Object} newTransaction - The transaction object to save.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export const postTransaction = async (newTransaction) => {
  try {
    const existingData = await fetchTransactions();
    const updatedData = [newTransaction, ...existingData]; // Add to top
    await AsyncStorage.setItem(TRANSACTION_KEY, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

/**
 * Calculates total income, expense, and balance from stored transactions.
 * @returns {Promise<Object>} Object containing income, expense, balance, and history.
 */
export const getFinancialSummary = async () => {
  const transactions = await fetchTransactions();
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') income += parseFloat(t.amount);
    else expense += parseFloat(t.amount);
  });

  return {
    income,
    expense,
    balance: income - expense,
    history: transactions
  };
};