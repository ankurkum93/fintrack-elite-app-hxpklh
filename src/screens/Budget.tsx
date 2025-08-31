import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card';

export default function Budget() {
  return (
    <View style={s.container}>
      <Card>
        <Text style={{ fontWeight: '700', color: '#fff' }}>Budget Overview</Text>
        <Text style={{ color: '#bfc8d6', marginTop: 8 }}>Radial chart with glowing segments</Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 } });
