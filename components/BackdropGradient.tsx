
import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

type Props = {
  variant?: 'default' | 'home' | 'auth';
  intensity?: number; // 0..1
};

// Soft blurred-looking gradient blobs positioned absolutely behind content
export default function BackdropGradient({ variant = 'default', intensity = 1 }: Props) {
  const { colors } = useTheme();
  const alpha = Math.max(0, Math.min(1, intensity));

  const topBlobColors =
    variant === 'home'
      ? [colors.primary, colors.secondary]
      : variant === 'auth'
      ? [colors.secondary, colors.primary]
      : [colors.primary, colors.secondary];

  const bottomBlobColors =
    variant === 'home'
      ? ['#10B981', colors.accent]
      : variant === 'auth'
      ? [colors.accent, '#10B981']
      : [colors.accent, '#10B981'];

  return (
    <View pointerEvents="none" style={{ position: 'absolute', inset: 0 }}>
      <LinearGradient
        colors={topBlobColors}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 280,
          height: 280,
          borderRadius: 280,
          opacity: 0.22 * alpha,
          boxShadow: '0 40px 120px rgba(2,6,23,0.25)' as any,
        }}
      />
      <LinearGradient
        colors={bottomBlobColors}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0.8, y: 1 }}
        style={{
          position: 'absolute',
          bottom: -160,
          left: -140,
          width: 340,
          height: 340,
          borderRadius: 340,
          opacity: 0.18 * alpha,
          boxShadow: '0 40px 120px rgba(2,6,23,0.22)' as any,
        }}
      />
    </View>
  );
}
