import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card';

const sample = [
  { id: '1', merchant: 'Starbucks', amount: 4.5, source: 'auto' },
  { id: '2', merchant: 'Uber', amount: 12.3, source: 'manual' },
  { id: '3', merchant: 'Amazon', amount: 49.99, source: 'auto' },
];

export default function Transactions() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Transactions</Text>
      <FlatList
        data={sample}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#fff' }}>{item.merchant}</Text>
              <Text style={{ color: '#fff' }}>€ {item.amount}</Text>
            </View>
            <Text style={{ color: '#bfc8d6', marginTop: 6 }}>{item.source === 'auto' ? 'Auto-detected 💡' : 'Manually added ✏️'}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 22, marginBottom: 12 },
});
