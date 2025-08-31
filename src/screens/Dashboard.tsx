import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Card from '@/components/Card';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Dashboard() {
  const nav = useNavigation<any>();
  function onAdd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.navigate('Add');
  }

  return (
    <View style={s.container}>
      <Text style={s.greet}>Good evening, Ankur 👋</Text>

      <Card>
        <Text style={s.cardTitle}>Current balance</Text>
        <Text style={s.balance}>€ 16,450</Text>
      </Card>

      <Card>
        <Text style={s.cardTitle}>Today’s Spend</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.large}>€ 2,500</Text>
          <View>
            <Text style={{ color: '#bfc8d6' }}>Animated bar here</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={s.cardTitle}>This Week’s Budget Progress</Text>
        <View style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={s.large}>70%</Text>
        </View>
      </Card>

      <Card>
        <Text style={s.cardTitle}>AI Insight of the Day</Text>
        <Text style={s.body}>Dining spend is 20% higher this week. Want to set a dining cap?</Text>
        <TouchableOpacity style={s.setLimit}>
          <Text style={{ fontWeight: '700' }}>Set Limit</Text>
        </TouchableOpacity>
      </Card>

      <TouchableOpacity style={s.fab} onPress={onAdd}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  greet: { fontSize: 20, color: '#fff', marginBottom: 12 },
  cardTitle: { fontWeight: '700', color: '#cbd5e1', marginBottom: 8 },
  balance: { fontSize: 36, fontWeight: '800', color: '#fff' },
  large: { fontSize: 24, fontWeight: '700', color: '#fff' },
  body: { color: '#bfc8d6', marginTop: 8 },
  setLimit: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#00D9D9', borderRadius: 12, alignSelf: 'flex-start' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D9D9',
    shadowRadius: 10,
    elevation: 8,
  },
});
