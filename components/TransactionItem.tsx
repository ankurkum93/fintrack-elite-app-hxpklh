
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import { Transaction } from '../context/TransactionsContext';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  item: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
};

const categoryToIcon = (category: string): keyof import('@expo/vector-icons').Ionicons['glyphMap'] => {
  const map: Record<string, keyof import('@expo/vector-icons').Ionicons['glyphMap']> = {
    Food: 'fast-food-outline',
    Transport: 'car-outline',
    Shopping: 'bag-outline',
    Bills: 'wallet-outline',
    Entertainment: 'game-controller-outline',
    Health: 'heart-outline',
    Other: 'ellipse-outline',
  };
  return map[category] || 'ellipse-outline';
};

const TransactionItem = ({ item, onPress, onDelete }: Props) => {
  const { colors } = useTheme();
  const negative = item.amount < 0;
  const amountColor = negative ? '#EF4444' : '#10B981';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.container, { backgroundColor: colors.backgroundAlt, boxShadow: '0 8px 20px rgba(2,6,23,0.08)' as any }]}>
      <View style={styles.left}>
        <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconWrap}>
          <Icon name={categoryToIcon(item.category)} size={18} color="#fff" />
        </LinearGradient>
        <View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.merchant || item.category}</Text>
          <Text style={[styles.subtitle, { color: colors.grey }]} numberOfLines={1}>
            {new Date(item.date).toLocaleDateString()} · {item.category} · {item.type === 'auto' ? 'Auto' : 'Manual'}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={[styles.amountPill, { backgroundColor: colors.background }]}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {negative ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
        {!!onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{ marginTop: 8 }}>
            <Icon name="trash-outline" size={18} color={colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    maxWidth: 180,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amountPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    boxShadow: '0 6px 14px rgba(2,6,23,0.08)' as any,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default TransactionItem;
