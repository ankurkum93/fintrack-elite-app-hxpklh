
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

type Props = {
  label: string;
  value: string;
  icon?: keyof import('@expo/vector-icons').Ionicons['glyphMap'];
  colorsOverride?: [string, string];
};

export default function MetricChip({ label, value, icon, colorsOverride }: Props) {
  const { colors } = useTheme();
  const gradient = colorsOverride || [colors.primary, colors.secondary];

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      <View style={{ display: 'contents' }}>
        {icon ? <Icon name={icon} size={16} color="#fff" /> : null}
      </View>
      <View style={{ marginLeft: icon ? 8 : 0 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
});
