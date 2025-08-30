
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionsContext';
import TransactionItem from '../../components/TransactionItem';
import Button from '../../components/Button';
import { router } from 'expo-router';

export default function TransactionsScreen() {
  const { commonStyles, colors } = useTheme();
  const { transactions, deleteTransaction } = useTransactions();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) => {
      const str = `${t.category} ${t.merchant || ''} ${t.notes || ''}`.toLowerCase();
      return str.includes(q);
    });
  }, [transactions, query]);

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20 }]}>Transactions</Text>
      </View>

      <View style={[commonStyles.card, { marginTop: 12 }]}>
        <TextInput
          placeholder="Search transactions"
          placeholderTextColor={colors.grey}
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 12,
            color: colors.text,
          }}
        />
        <View style={{ height: 10 }} />
        <Button text="Add Expense" onPress={() => router.push('/add-expense')} />
      </View>

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {filtered.map((t) => (
          <TransactionItem
            key={t.id}
            item={t}
            onPress={() => router.push({ pathname: '/add-expense', params: { editId: t.id } })}
            onDelete={() => deleteTransaction(t.id)}
          />
        ))}
        {filtered.length === 0 ? <Text style={[commonStyles.text, { textAlign: 'center', opacity: 0.7, marginTop: 20 }]}>No results</Text> : null}
      </ScrollView>
    </View>
  );
}
