
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionsContext';
import Button from '../../components/Button';
import TransactionItem from '../../components/TransactionItem';
import DoughnutChart from '../../components/DoughnutChart';
import Icon from '../../components/Icon';
import { router } from 'expo-router';
import BottomSheetWrapper, { BottomSheetWrapperRef } from '../../components/BottomSheetWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import MetricChip from '../../components/MetricChip';

export default function Dashboard() {
  const { commonStyles, colors, toggleTheme } = useTheme();
  const { transactions, balance } = useTransactions();
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);
  const spentRaw = useMemo(() => {
    const out = transactions.filter((t) => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
    const inc = transactions.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
    const denom = Math.max(inc, 1);
    return Math.min(out / denom, 1);
  }, [transactions]);
  const income = useMemo(() => transactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0), [transactions]);

  const [animatedSpent, setAnimatedSpent] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const dur = 650;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      setAnimatedSpent(spentRaw * t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [spentRaw]);

  const sheetRef = useRef<BottomSheetWrapperRef>(null);

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}>
        <View style={[commonStyles.rowBetween, { marginTop: 8 }]}>
          <Text style={[commonStyles.title, { fontSize: 22, textAlign: 'left' }]}>Dashboard</Text>
          <TouchableOpacity onPress={() => sheetRef.current?.expand()} style={{ padding: 8 }}>
            <Icon name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 16, marginTop: 12, boxShadow: '0px 16px 32px rgba(2,6,23,0.16)' as any }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>Current balance</Text>
          <Text style={{ color: '#fff', fontSize: 34, fontWeight: '900', marginTop: 4 }}>${balance.toFixed(2)}</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <DoughnutChart progress={animatedSpent} label="Spend vs Income" />
            <View style={{ width: 12 }} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <MetricChip label="Income" value={`$${income.toFixed(0)}`} icon="trending-up-outline" colorsOverride={['#10B981', '#34D399']} />
              <View style={{ height: 8 }} />
              <MetricChip label="Expenses" value={`$${expenses.toFixed(0)}`} icon="trending-down-outline" colorsOverride={['#EF4444', '#F97316']} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Button text="Add Expense" onPress={() => router.push('/add-expense')} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Button text="Add Income" onPress={() => router.push({ pathname: '/add-expense', params: { income: '1' } })} variant="secondary" />
            </View>
          </View>
        </LinearGradient>

        <View style={[commonStyles.rowBetween, { marginTop: 18 }]}>
          <Text style={[commonStyles.title, { fontSize: 18, textAlign: 'left' }]}>Recent transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={{ color: colors.accent, fontWeight: '800' }}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          {recent.map((t) => (
            <TransactionItem key={t.id} item={t} onPress={() => router.push({ pathname: '/add-expense', params: { editId: t.id } })} />
          ))}
          {recent.length === 0 ? <Text style={[commonStyles.text, { opacity: 0.7, textAlign: 'center', marginTop: 16 }]}>No transactions yet.</Text> : null}
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
