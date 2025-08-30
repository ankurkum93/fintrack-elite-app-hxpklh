
import React, { useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionsContext';
import Button from '../../components/Button';
import TransactionItem from '../../components/TransactionItem';
import DoughnutChart from '../../components/DoughnutChart';
import Icon from '../../components/Icon';
import { router } from 'expo-router';
import BottomSheetWrapper, { BottomSheetWrapperRef } from '../../components/BottomSheetWrapper';

export default function Dashboard() {
  const { commonStyles, colors, toggleTheme } = useTheme();
  const { transactions, balance } = useTransactions();
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);
  const spent = useMemo(() => {
    const out = transactions.filter((t) => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
    const inc = transactions.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const denom = Math.max(inc, 1);
    return Math.min(out / denom, 1);
  }, [transactions]);

  const sheetRef = useRef<BottomSheetWrapperRef>(null);

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}>
        <View style={[commonStyles.rowBetween, { marginTop: 8 }]}>
          <Text style={[commonStyles.title, { fontSize: 20 }]}>Dashboard</Text>
          <TouchableOpacity onPress={() => sheetRef.current?.expand()} style={{ padding: 8 }}>
            <Icon name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[commonStyles.card, { marginTop: 12 }]}>
          <Text style={[commonStyles.text, { opacity: 0.7 }]}>Current balance</Text>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 4 }}>${balance.toFixed(2)}</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <DoughnutChart progress={spent} label="Spend vs Income" />
            <View style={{ width: 12 }} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={[commonStyles.text]}>Recent snapshot</Text>
              <Text style={[commonStyles.text, { opacity: 0.7, marginTop: 6 }]}>
                You spent {Math.round(spent * 100)}% of your income recently.
              </Text>
            </View>
          </View>
        </View>

        <View style={[commonStyles.rowBetween, { marginTop: 14 }]}>
          <Text style={[commonStyles.title, { fontSize: 18 }]}>Recent transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={{ color: colors.accent, fontWeight: '700' }}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          {recent.map((t) => (
            <TransactionItem key={t.id} item={t} onPress={() => router.push({ pathname: '/add-expense', params: { editId: t.id } })} />
          ))}
          {recent.length === 0 ? <Text style={[commonStyles.text, { opacity: 0.7, textAlign: 'center', marginTop: 16 }]}>No transactions yet.</Text> : null}
        </View>

        <View style={{ marginTop: 20 }}>
          <Button text="Add Expense" onPress={() => router.push('/add-expense')} />
        </View>
      </ScrollView>

      <BottomSheetWrapper ref={sheetRef} snapPoints={['35%', '50%']}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>Quick Settings</Text>
        <Button text="Toggle theme" onPress={toggleTheme} />
        <View style={{ height: 10 }} />
        <Text style={{ color: colors.text, opacity: 0.7 }}>Manage privacy and permissions from the full Settings tab.</Text>
      </BottomSheetWrapper>
    </View>
  );
}
