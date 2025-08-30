
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
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
import BackdropGradient from '../../components/BackdropGradient';
import * as Haptics from 'expo-haptics';
import { useUser } from '../../context/UserContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const { commonStyles, colors } = useTheme();
  const { transactions, balance } = useTransactions();
  const { user, isPremium } = useUser();

  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);
  const income = useMemo(() => transactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0), [transactions]);

  const spentRaw = useMemo(() => {
    const denom = Math.max(income, 1);
    return Math.min(expenses / denom, 1);
  }, [income, expenses]);

  const todaySpent = useMemo(() => {
    const d = new Date().toDateString();
    return transactions.filter((t) => new Date(t.date).toDateString() === d && t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
  }, [transactions]);

  const weeklyBudget = 500; // demo budget
  const weeklySpent = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return transactions
      .filter((t) => new Date(t.date) >= start && t.amount < 0)
      .reduce((a, b) => a + Math.abs(b.amount), 0);
  }, [transactions]);

  const [animatedSpent, setAnimatedSpent] = useState(0);
  const [barWidth] = useState(new Animated.Value(0));

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

  useEffect(() => {
    const ratio = Math.min(1, todaySpent / 100); // demo max 100
    Animated.timing(barWidth, { toValue: ratio, duration: 600, useNativeDriver: false }).start();
  }, [todaySpent, barWidth]);

  const sheetRef = useRef<BottomSheetWrapperRef>(null);

  const handleAddExpense = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch (e) { console.log(e); }
    router.push('/add-expense');
  };

  const greeting = `${getGreeting()}, ${user.name || 'Guest'} 👋`;

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <BackdropGradient variant="home" intensity={1} />
      <ScrollView contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}>
        <View style={[commonStyles.rowBetween, { marginTop: 8 }]}>
          <Text style={[commonStyles.title, { fontSize: 22, textAlign: 'left' }]}>{greeting}</Text>
          <TouchableOpacity onPress={() => sheetRef.current?.expand()} style={{ padding: 8 }}>
            <Icon name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 22, padding: 16, marginTop: 12, boxShadow: '0px 22px 44px rgba(2,6,23,0.18)' as any }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>Current balance</Text>
            {isPremium ? (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>Premium</Text>
              </View>
            ) : null}
          </View>
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
          <View style={{ marginTop: 14 }}>
            <Text style={{ color: '#fff', opacity: 0.85, fontWeight: '700', marginBottom: 6 }}>Today’s Spend</Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', height: 10, borderRadius: 10, overflow: 'hidden' }}>
              <Animated.View style={{ height: '100%', width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: '#D4AF37' }} />
            </View>
            <Text style={{ color: '#fff', opacity: 0.85, marginTop: 4, fontWeight: '800' }}>${todaySpent.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Button text="Add Expense" onPress={handleAddExpense} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Button text="Analytics" onPress={() => router.push('/(tabs)/analytics')} variant="secondary" />
            </View>
          </View>
        </LinearGradient>

        <View style={[commonStyles.rowBetween, { marginTop: 18 }]}>
          <Text style={[commonStyles.title, { fontSize: 18, textAlign: 'left' }]}>AI Insight of the Day</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/budget')}>
            <Text style={{ color: '#22C55E', fontWeight: '800' }}>Set Limit</Text>
          </TouchableOpacity>
        </View>
        <View style={[commonStyles.card, { marginTop: 8 }]}>
          <Text style={{ color: colors.text }}>Dining spend is 20% higher this week. Want to set a dining cap?</Text>
        </View>

        <View style={[commonStyles.rowBetween, { marginTop: 18 }]}>
          <Text style={[commonStyles.title, { fontSize: 18, textAlign: 'left' }]}>This Week’s Budget Progress</Text>
          <Text style={{ color: colors.text, fontWeight: '800' }}>${weeklySpent.toFixed(0)}/${weeklyBudget}</Text>
        </View>
        <View style={{ marginTop: 8, alignItems: 'flex-start' }}>
          <DoughnutChart progress={Math.min(1, weeklySpent / weeklyBudget)} />
        </View>

        <View style={[commonStyles.rowBetween, { marginTop: 18 }]}>
          <Text style={[commonStyles.title, { fontSize: 18, textAlign: 'left' }]}>Recent transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={{ color: '#22C55E', fontWeight: '800' }}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          {recent.map((t) => (
            <TransactionItem key={t.id} item={t} onPress={() => router.push({ pathname: '/add-expense', params: { editId: t.id } })} />
          ))}
          {recent.length === 0 ? <Text style={[commonStyles.text, { opacity: 0.7, textAlign: 'center', marginTop: 16 }]}>No transactions yet.</Text> : null}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleAddExpense}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 64,
          height: 64,
          borderRadius: 40,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 18px 36px rgba(2,6,23,0.25)' as any,
          backgroundColor: 'transparent',
        }}
        activeOpacity={0.9}
      >
        <LinearGradient colors={[colors.accent, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', inset: 0, borderRadius: 40 }} />
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <BottomSheetWrapper ref={sheetRef} snapPoints={['40%', '60%']}>
        <Text style={{ fontSize: 16, fontWeight: '800', marginBottom: 10, color: colors.text }}>Quick Settings</Text>
        <Button text="Go to Settings" onPress={() => router.push('/(tabs)/settings')} />
        <View style={{ height: 10 }} />
        <Text style={{ color: colors.text, opacity: 0.7 }}>Manage themes, privacy, and premium in Settings.</Text>
      </BottomSheetWrapper>
    </View>
  );
}
