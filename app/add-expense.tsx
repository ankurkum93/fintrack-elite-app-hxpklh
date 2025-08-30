
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionsContext';
import * as Haptics from 'expo-haptics';

export default function AddExpense() {
  const { commonStyles, colors } = useTheme();
  const { categories, addTransaction, transactions, updateTransaction } = useTransactions();
  const params = useLocalSearchParams<{ editId?: string }>();
  const editing = useMemo(() => transactions.find((t) => t.id === params.editId), [transactions, params.editId]);

  const [amount, setAmount] = useState(editing ? Math.abs(editing.amount).toString() : '');
  const [category, setCategory] = useState(editing ? editing.category : categories[0]);
  const [merchant, setMerchant] = useState(editing?.merchant || '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [date, setDate] = useState(editing ? new Date(editing.date) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isIncome, setIsIncome] = useState(editing ? editing.amount > 0 : false);

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
        <Text style={[commonStyles.title, { fontSize: 20 }]}>{editing ? 'Edit Transaction' : 'Add Expense'}</Text>
      </View>

      <View style={[commonStyles.card, { marginTop: 12 }]}>
        <Text style={[commonStyles.text, { marginBottom: 6 }]}>Amount</Text>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="$0.00"
          placeholderTextColor={colors.grey}
          value={amount}
          onChangeText={setAmount}
          style={{ backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 10 }}
        />
        <View style={{ height: 10 }} />

        <Text style={[commonStyles.text, { marginBottom: 6 }]}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map((c) => {
            const active = category === c;
            return (
              <Text
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  marginRight: 8,
                  marginBottom: 8,
                  borderRadius: 20,
                  backgroundColor: active ? colors.primary : colors.background,
                  color: active ? '#fff' : colors.text,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)' as any,
                }}
              >
                {c}
              </Text>
            );
          })}
        </View>

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6 }]}>Merchant</Text>
        <TextInput
          placeholder="Where did you spend?"
          placeholderTextColor={colors.grey}
          value={merchant}
          onChangeText={setMerchant}
          style={{ backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 10 }}
        />

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6 }]}>Notes</Text>
        <TextInput
          placeholder="Optional"
          placeholderTextColor={colors.grey}
          value={notes}
          onChangeText={setNotes}
          style={{ backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 10 }}
        />

        <Text style={[commonStyles.text, { marginTop: 6, marginBottom: 6 }]}>Date</Text>
        <Text
          onPress={() => setShowPicker(true)}
          style={{ backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 10 }}
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
              backgroundColor: !isIncome ? '#E53E3E' : colors.background,
              color: !isIncome ? '#fff' : colors.text,
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
              backgroundColor: isIncome ? '#2F855A' : colors.background,
              color: isIncome ? '#fff' : colors.text,
            }}
          >
            Income
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Button text={editing ? 'Save Changes' : 'Add'} onPress={save} />
      </View>

      <View style={{ marginTop: 8 }}>
        <Button text="Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}
