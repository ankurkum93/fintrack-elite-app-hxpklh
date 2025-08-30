
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionsContext';
import TransactionItem from '../../components/TransactionItem';
import Button from '../../components/Button';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import BackdropGradient from '../../components/BackdropGradient';
import GlassCard from '../../components/GlassCard';

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
      <BackdropGradient intensity={0.8} />
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'left' }]}>Transactions</Text>
      </View>

      <GlassCard style={{ marginTop: 12 }}>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', left: 10, top: 12 }}>
            <Icon name="search-outline" size={18} color={colors.grey} />
          </View>
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor={colors.grey}
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: 'transparent',
              borderRadius: 12,
              paddingVertical: 12,
              paddingLeft: 36,
              paddingRight: 12,
              color: colors.text,
              borderWidth: 1,
              borderColor: 'rgba(148,163,184,0.18)',
            }}
          />
        </View>
        <View style={{ height: 10 }} />
        <Button text="Add Expense" onPress={() => router.push('/add-expense')} />
      </GlassCard>

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
