
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: any;
  intensity?: number; // 0..100
};

export default function GlassCard({ children, style, intensity = 28 }: Props) {
  const { isDark, colors } = useTheme();

  return (
    <LinearGradient
      colors={[`${colors.primary}66`, `${colors.secondary}66`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.border, { boxShadow: '0 18px 36px rgba(2,6,23,0.12)' as any }]}
    >
      <View style={styles.innerShadow}>
        <BlurView
          intensity={intensity}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.wrap, { backgroundColor: isDark ? 'rgba(17,25,39,0.55)' : 'rgba(255,255,255,0.55)' }, style]}
        >
          {children}
        </BlurView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  border: {
    borderRadius: 22,
    padding: 1.5,
    width: '100%',
  },
  innerShadow: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  wrap: {
    borderRadius: 20,
    padding: 16,
    width: '100%',
    backdropFilter: 'blur(8px)' as any,
  },
});
