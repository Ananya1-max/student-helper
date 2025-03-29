import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [groupMembers, setGroupMembers] = useState([{ id: '1', name: 'A' }, { id: '2', name: 'B' }]); // For Group Expense Splitter
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitStrategy, setSplitStrategy] = useState('equal'); // 'equal', 'byAmount', 'percentages'
  const [strategyAmounts, setStrategyAmounts] = useState({}); // For 'byAmount' and 'percentages'
  const [totalExpense, setTotalExpense] = useState(0);

  const categories = ['Food', 'Housing', 'Transportation', 'Entertainment', 'Other'];

  // Load expenses from AsyncStorage
    useEffect(() => {
        const loadExpenses = async () => {
            // try {
            //   const storedExpenses = await AsyncStorage.getItem('expenses');
            //   if (storedExpenses) {
            //     setExpenses(JSON.parse(storedExpenses));
            //   }
            // } catch (error) {
            //     console.error("Failed to load expenses", error);
            // }
            setTimeout(() => {
                const storedExpenses = [
                    { id: '1', description: 'Groceries', amount: 50, category: 'Food', date: Date.now() },
                    { id: '2', description: 'Rent', amount: 1000, category: 'Housing', date: Date.now() },
                ];
                setExpenses(storedExpenses);
            }, 500);
        };
        loadExpenses();
    }, []);

    // Save expenses to AsyncStorage
    useEffect(() => {
        // const saveExpenses = async () => {
        //     try {
        //         await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
        //     } catch (error) {
        //         console.error("Failed to save expenses", error);
        //     }
        // };
        // saveExpenses();
    }, [expenses]);

    useEffect(() => {
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpense(total);
    }, [expenses]);

  const addExpense = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please enter description and amount.');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: Date.now(),
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

    const deleteExpense = (id) => {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    };

  // Group Expense Splitter Functions
    const handleMemberSelect = (memberId) => {
        setSelectedMembers((prevMembers) =>
            prevMembers.includes(memberId)
                ? prevMembers.filter((id) => id !== memberId)
                : [...prevMembers, memberId]
        );
    };

    const handleSplit = () => {
      if (selectedMembers.length === 0) {
          Alert.alert("Error", "Please select members to split the expense with.");
          return;
      }
        const numMembers = selectedMembers.length;
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert("Error", "Invalid amount.");
            return;
        }
        let splitAmounts = {};
        if (splitStrategy === 'equal') {
            const equalAmount = parsedAmount / numMembers;
            selectedMembers.forEach(member => {
                splitAmounts[member] = equalAmount.toFixed(2);
            });
        } else if (splitStrategy === 'byAmount' || splitStrategy === 'percentages') {
             let totalStrategyAmount = 0;
            selectedMembers.forEach(memberId => {
                const inputAmount = parseFloat(strategyAmounts[memberId] || 0);
                 if (isNaN(inputAmount) || inputAmount < 0) {
                    Alert.alert("Error", "Invalid amount for a member.");
                    return;
                }
                totalStrategyAmount += (splitStrategy === 'byAmount') ? inputAmount : inputAmount/100 * parsedAmount;
                splitAmounts[memberId] = inputAmount.toFixed(2);
            });
            if(splitStrategy === 'byAmount' && totalStrategyAmount !== parsedAmount){
                 Alert.alert("Error", "Sum of amounts should be equal to the total expense.");
                 return;
            }
             if(splitStrategy === 'percentages' && totalStrategyAmount !== parsedAmount){
                 Alert.alert("Error", "Sum of percentages should be equal to 100%.");
                 return;
            }
        }
        else{
            Alert.alert("Error", "Invalid Split Strategy.");
            return;
        }
        // Display or use splitAmounts
        console.log(splitAmounts);
        Alert.alert("Split Amounts", JSON.stringify(splitAmounts));
    };

    const handleStrategyAmountChange = (memberId, value) => {
        setStrategyAmounts(prevAmounts => ({
            ...prevAmounts,
            [memberId]: value,
        }));
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={{ width: '100%'}}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
        <Button title="Add Expense" onPress={addExpense} />
      </View>
        <Text style={styles.total}>Total Expense: ${totalExpense.toFixed(2)}</Text>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
                </Text>
            </View>

            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            <Button title="Delete" onPress={() => deleteExpense(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.title}>Group Expense Splitter</Text>
            <View style={styles.membersContainer}>
                <Text style={styles.label}>Select Group Members:</Text>
                {groupMembers.map(member => (
                    <Button
                        key={member.id}
                        title={member.name}
                        onPress={() => handleMemberSelect(member.id)}
                        color={selectedMembers.includes(member.id) ? 'green' : undefined}
                    />
                ))}
            </View>

            <Picker
                selectedValue={splitStrategy}
                onValueChange={(value) => {
                    setSplitStrategy(value);
                    setStrategyAmounts({}); // Reset amounts when strategy changes
                }}
                style={{ width: '100%' }}
            >
                <Picker.Item label="Split Equally" value="equal" />
                <Picker.Item label="Split by Amount" value="byAmount" />
                <Picker.Item label="Split by Percentages" value="percentages" />
            </Picker>
             {/* Conditional rendering of amount inputs */}
            {(splitStrategy === 'byAmount' || splitStrategy === 'percentages') && (
                <View style={styles.strategyAmountsContainer}>
                    {selectedMembers.map(memberId => {
                        const member = groupMembers.find(m => m.id === memberId); // Find member object
                        return (
                            <View key={memberId} style={styles.strategyAmountInput}>
                                <Text>{member.name}:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={splitStrategy === 'byAmount' ? "Amount" : "Percentage"}
                                    value={strategyAmounts[memberId] || ''}
                                    onChangeText={(text) => handleStrategyAmountChange(memberId, text)}
                                    keyboardType="numeric"
                                />
                            </View>
                        );
                    })}
                </View>
            )}
            <Button title="Split Expense" onPress={handleSplit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  description: {
    fontSize: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
    category: {
    fontSize: 14,
    color: 'gray'
  },
  date:{
    fontSize: 12,
    color: 'darkgray'
  },
    membersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
        alignSelf: 'center'
    },
    strategyAmountsContainer: {
        width: '100%',
        marginVertical: 10,
    },
     strategyAmountInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'flex-end'
    }
});

export default ExpenseTracker;