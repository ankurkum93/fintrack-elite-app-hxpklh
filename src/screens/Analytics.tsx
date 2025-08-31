import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import Card from '@/components/Card';

export default function Analytics() {
  const data = [{ x: 'Food', y: 40 }, { x: 'Travel', y: 25 }, { x: 'Shop', y: 35 }];
  return (
    <View style={s.container}>
      <Card>
        <VictoryPie animate={{ duration: 800 }} data={data} />
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 } });
