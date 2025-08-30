
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCards } from '../context/CardsContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddCard() {
  const { commonStyles, colors } = useTheme();
  const { addCard } = useCards();

  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nickname, setNickname] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [error, setError] = useState<string | null>(null);

  const masked = useMemo(() => {
    const n = number.replace(/\D/g, '');
    return n.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }, [number]);

  const expiryMasked = useMemo(() => {
    const n = expiry.replace(/\D/g, '').slice(0, 4);
    if (n.length <= 2) return n;
    return `${n.slice(0, 2)}/${n.slice(2)}`;
  }, [expiry]);

  const handleSave = async () => {
    setError(null);
    const result = addCard({ holder, number, expiry: expiryMasked, cvv, nickname, type });
    if (!result) {
      setError('Please check your card details.');
      return;
    }
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.log('Haptics error', e);
    }
    router.replace('/(tabs)/cards');
  };

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'left' }]}>Add Card</Text>
      </View>

      <GlassCard style={{ marginTop: 12 }}>
        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>Cardholder Name</Text>
        <TextInput
          placeholder="Full name"
          placeholderTextColor={colors.grey}
          value={holder}
          onChangeText={setHolder}
          autoCapitalize="words"
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        />

        <View style={{ height: 10 }} />
        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>Card Number</Text>
        <TextInput
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={colors.grey}
          keyboardType="number-pad"
          value={masked}
          onChangeText={(t) => setNumber(t)}
          maxLength={19}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)', letterSpacing: 1.5 }}
        />

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>Expiry</Text>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={colors.grey}
              keyboardType="number-pad"
              value={expiryMasked}
              onChangeText={setExpiry}
              maxLength={5}
              style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>CVV</Text>
            <TextInput
              placeholder="***"
              placeholderTextColor={colors.grey}
              keyboardType="number-pad"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
              style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
            />
          </View>
        </View>

        <View style={{ height: 10 }} />
        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>Type</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            onPress={() => setType('credit')}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginRight: 8,
              borderRadius: 20,
              backgroundColor: type === 'credit' ? '#10B981' : 'transparent',
              color: type === 'credit' ? '#fff' : colors.text,
              fontWeight: '800',
              borderWidth: type === 'credit' ? 0 : 1,
              borderColor: 'rgba(148,163,184,0.18)',
            }}
          >
            Credit
          </Text>
          <Text
            onPress={() => setType('debit')}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: type === 'debit' ? '#6366F1' : 'transparent',
              color: type === 'debit' ? '#fff' : colors.text,
              fontWeight: '800',
              borderWidth: type === 'debit' ? 0 : 1,
              borderColor: 'rgba(148,163,184,0.18)',
            }}
          >
            Debit
          </Text>
        </View>

        <View style={{ height: 10 }} />
        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 8 }]}>Nickname (optional)</Text>
        <TextInput
          placeholder="Personal, Business, Travel ..."
          placeholderTextColor={colors.grey}
          value={nickname}
          onChangeText={setNickname}
          style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
        />

        {error ? <Text style={{ color: '#EF4444', fontWeight: '800', marginTop: 8 }}>{error}</Text> : null}
      </GlassCard>

      <View style={{ marginTop: 16 }}>
        <Button text="Save Card" onPress={handleSave} />
      </View>

      <View style={{ marginTop: 8 }}>
        <Button text="Back to Home" onPress={() => router.replace('/(tabs)')} variant="ghost" />
      </View>
    </View>
  );
}
