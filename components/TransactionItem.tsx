
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import { Transaction } from '../context/TransactionsContext';

type Props = {
  item: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
};

const TransactionItem = ({ item, onPress, onDelete }: Props) => {
  const { colors } = useTheme();
  const negative = item.amount < 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, { backgroundColor: colors.backgroundAlt, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' as any }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.badge, { backgroundColor: item.type === 'auto' ? colors.secondary : colors.accent }]} />
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{item.merchant || item.category}</Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {new Date(item.date).toLocaleDateString()} · {item.category} · {item.type === 'auto' ? 'Auto' : 'Manual'}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.amount, { color: negative ? '#E53E3E' : '#2F855A' }]}>
          {negative ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
        </Text>
        {!!onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{ marginTop: 6 }}>
            <Icon name="trash-outline" size={18} color={colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 8,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
  },
});

export default TransactionItem;
