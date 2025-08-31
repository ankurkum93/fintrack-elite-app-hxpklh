import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const nav = useNavigation<any>();

  return (
    <LinearGradient colors={['#0B132B', '#1C1C1C']} style={s.container}>
      <PagerView style={{ flex: 1 }} initialPage={0}>
        <View key="1" style={s.page}>
          <Text style={s.title}>Track automatically. Spend smarter.</Text>
          <Text style={s.body}>Auto-capture expenses from notifications and bank sync.</Text>
        </View>

        <View key="2" style={s.page}>
          <Text style={s.title}>See insights. Predict the future.</Text>
          <Text style={s.body}>Smart charts & forecasts to help you plan ahead.</Text>
        </View>

        <View key="3" style={s.page}>
          <Text style={s.title}>Your finances, secured.</Text>
          <Text style={s.body}>Face ID & biometric security to safeguard your data.</Text>
          <TouchableOpacity style={s.cta} onPress={() => nav.navigate('Main')}>
            <Text style={s.ctaText}>Start 14-day Premium Trial</Text>
          </TouchableOpacity>
        </View>
      </PagerView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 80 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  body: { color: '#bfc8d6', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  cta: { marginTop: 20, backgroundColor: '#F1C40F', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 28 },
  ctaText: { fontWeight: '700' },
});
