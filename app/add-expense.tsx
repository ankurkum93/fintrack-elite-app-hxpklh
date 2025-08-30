
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionsContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../components/GlassCard';

export default function AddExpense() {
  const { commonStyles, colors } = useTheme();
  const { categories, addTransaction, transactions, updateTransaction } = useTransactions();
  const params = useLocalSearchParams<{ editId?: string; income?: string }>();
  const editing = useMemo(() => transactions.find((t) => t.id === params.editId), [transactions, params.editId]);

  const [amount, setAmount] = useState(editing ? Math.abs(editing.amount).toString() : '');
  const [category, setCategory] = useState(editing ? editing.category : categories[0]);
  const [merchant, setMerchant] = useState(editing?.merchant || '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [date, setDate] = useState(editing ? new Date(editing.date) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isIncome, setIsIncome] = useState(editing ? editing.amount > 0 : !!params.income);

  useEffect(() => {
    console.log('AddExpense mounted, editing:', !!editing);
  }, [editing]);

  const save = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      console.log('Invalid amount');
      return;
    }
    const finalAmount = isIncome ? Math.abs(amt) : -Math.abs(amt);
    if (editing) {
      updateTransaction(editing.id, {
        amount: finalAmount,
        category,
        merchant,
        notes,
        date: date.toISOString(),
      });
    } else {
      addTransaction({
        amount: finalAmount,
        category,
        date: date.toISOString(),
        merchant,
        notes,
        type: 'manual',
      });
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'left' }]}>{editing ? 'Edit Transaction' : 'Add Expense'}</Text>
      </View>

      <GlassCard style={{ marginTop: 12 }}>
        <Text style={[commonStyles.text, { marginBottom: 6, textAlign: 'left' }]}>Amount</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="$0.00"
          placeholderTextColor={colors.grey}
          value={amount}
          onChangeText={setAmount}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        />
        <View style={{ height: 10 }} />

        <Text style={[commonStyles.text, { marginBottom: 6, textAlign: 'left' }]}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map((c) => {
            const active = category === c;
            return (
              <View key={c} style={{ marginRight: 8, marginBottom: 8 }}>
                {active ? (
                  <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20 }}>
                    <Text
                      onPress={() => setCategory(c)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        color: '#fff',
                        fontWeight: '800',
                      }}
                    >
                      {c}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text
                    onPress={() => setCategory(c)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      backgroundColor: 'transparent',
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: 'rgba(148,163,184,0.18)',
                    }}
                  >
                    {c}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6, textAlign: 'left' }]}>Merchant</Text>
        <TextInput
          placeholder="Where did you spend?"
          placeholderTextColor={colors.grey}
          value={merchant}
          onChangeText={setMerchant}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        />

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6, textAlign: 'left' }]}>Notes</Text>
        <TextInput
          placeholder="Optional"
          placeholderTextColor={colors.grey}
          value={notes}
          onChangeText={setNotes}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        />

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6, textAlign: 'left' }]}>Date</Text>
        <Text
          onPress={() => setShowPicker(true)}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        >
          {date.toDateString()}
        </Text>
        {showPicker && (
          <DateTimePicker
            value={date}
            onChange={(_, d) => {
              setShowPicker(Platform.OS === 'ios');
              if (d) setDate(d);
            }}
            mode="date"
          />
        )}

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Text
            onPress={() => setIsIncome(false)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 8,
              borderRadius: 20,
              backgroundColor: !isIncome ? '#EF4444' : 'transparent',
              color: !isIncome ? '#fff' : colors.text,
              fontWeight: '800',
              borderWidth: !isIncome ? 0 : 1,
              borderColor: 'rgba(148,163,184,0.18)',
            }}
          >
            Expense
          </Text>
          <Text
            onPress={() => setIsIncome(true)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: isIncome ? '#10B981' : 'transparent',
              color: isIncome ? '#fff' : colors.text,
              fontWeight: '800',
              borderWidth: isIncome ? 0 : 1,
              borderColor: 'rgba(148,163,184,0.18)',
            }}
          >
            Income
          </Text>
        </View>
      </GlassCard>

      <View style={{ marginTop: 16 }}>
        <Button text={editing ? 'Save Changes' : 'Add'} onPress={save} />
      </View>

      <View style={{ marginTop: 8 }}>
        <Button text="Back" onPress={() => router.back()} variant="ghost" />
      </View>
    </View>
  );
}
