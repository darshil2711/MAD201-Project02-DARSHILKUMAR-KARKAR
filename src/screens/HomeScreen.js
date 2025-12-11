// src/screens/HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  // Load data whenever the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('transactions');
      if (storedData) {
        const transactions = JSON.parse(storedData);
        let inc = 0;
        let exp = 0;

        transactions.forEach(t => {
          if (t.type === 'Income') inc += parseFloat(t.amount);
          else exp += parseFloat(t.amount);
        });

        setTotalIncome(inc);
        setTotalExpense(exp);
        setBalance(inc - exp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Dashboard</Text>

      {/* Balance Card */}
      <View style={[styles.card, styles.balanceCard]}>
        <Text style={styles.cardLabel}>Current Balance</Text>
        <Text style={styles.cardAmount}>${balance.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        {/* Income Card */}
        <View style={[styles.card, styles.incomeCard]}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={styles.cardAmount}>+${totalIncome.toFixed(2)}</Text>
        </View>

        {/* Expense Card */}
        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={styles.cardAmount}>-${totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => navigation.navigate('Add')}>
        <Text style={styles.btnText}>Add New Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, styles.secondaryBtn]} 
        onPress={() => navigation.navigate('Transactions')}>
        <Text style={styles.secondaryBtnText}>View All Transactions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceCard: { backgroundColor: '#4a90e2' },
  incomeCard: { backgroundColor: '#2ecc71', flex: 1, marginRight: 10 },
  expenseCard: { backgroundColor: '#e74c3c', flex: 1, marginLeft: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  cardAmount: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  btn: {
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#34495e' },
  secondaryBtnText: { color: '#34495e', fontSize: 16 },
});

export default HomeScreen;