import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Card from '@/components/Card';

export default function Settings() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Settings</Text>
      <Card>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Theme</Text>
        <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
          <Text style={{ color: '#bfc8d6' }}>Classic Dark</Text>
          <Switch value />
        </View>
      </Card>

      <Card>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Security</Text>
        <Text style={{ color: '#bfc8d6', marginTop: 8 }}>Enable App Lock / Biometrics</Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { color: '#fff', fontSize: 22, marginBottom: 12 } });
