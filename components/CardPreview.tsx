
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import type { Card } from '../context/CardsContext';

type Props = {
  card: Card;
  onPress?: () => void;
  right?: React.ReactNode;
};

const brandToIcon: Record<string, keyof typeof import('@expo/vector-icons').Ionicons.glyphMap> = {
  Visa: 'logo-visa' as any, // Not available in Ionicons, fallback to 'card-outline'
  Mastercard: 'card-outline',
  Amex: 'card-outline',
  Discover: 'card-outline',
  Other: 'card-outline',
};

export default function CardPreview({ card, onPress, right }: Props) {
  const { colors } = useTheme();
  const label = `${card.brand} ${card.type === 'debit' ? 'Debit' : 'Credit'}`;
  const exp = `${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`;

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, { boxShadow: '0 18px 36px rgba(2,6,23,0.18)' as any }]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text onPress={onPress} style={styles.label}>{label}</Text>
          <Text onPress={onPress} style={styles.number}>•••• •••• •••• {card.last4}</Text>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <Text onPress={onPress} style={[styles.meta, { marginRight: 12 }]}>EXP {exp}</Text>
            {card.nickname ? <Text onPress={onPress} style={styles.meta}>{card.nickname}</Text> : null}
          </View>
          <Text onPress={onPress} style={[styles.holder]}>{card.holder}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Icon name={brandToIcon[card.brand] || 'card-outline'} color="#FFFFFF" size={30} />
          {right}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    padding: 16,
    width: '100%',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },
  number: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 2,
  },
  meta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },
  holder: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
});
