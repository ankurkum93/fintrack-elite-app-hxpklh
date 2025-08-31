import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createExpense as apiCreateExpense } from '@/services/api';

export default function AddExpense({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');

  async function onSave() {
    await apiCreateExpense({ amount: Number(amount || 0), merchant, source: 'manual', date: new Date().toISOString() });
    navigation.goBack();
  }

  return (
    <View style={s.container}>
      <Text style={s.label}>Amount</Text>
      <TextInput keyboardType="numeric" style={s.input} value={amount} onChangeText={setAmount} placeholder="0.00" />
      <Text style={s.label}>Merchant</Text>
      <TextInput style={s.input} value={merchant} onChangeText={setMerchant} />
      <TouchableOpacity style={s.receipt}>
        <Text style={{ color: '#fff' }}>Upload Receipt (OCR)</Text>
      </TouchableOpacity>
      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 0, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, color: '#fff', marginBottom: 12 },
  label: { color: '#cbd5e1', marginBottom: 6 },
  receipt: { padding: 12, backgroundColor: '#2ECC71', borderRadius: 12, marginVertical: 12, alignItems: 'center' },
});
