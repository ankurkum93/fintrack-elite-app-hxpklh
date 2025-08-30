
import React, { useRef } from 'react';
import { Text, StyleSheet, View, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ text, onPress, style, textStyle, variant = 'primary' }: ButtonProps) {
  const { colors } = useTheme();
  const gradientColors = variant === 'primary'
    ? [colors.primary, colors.secondary]
    : variant === 'secondary'
    ? [colors.accent, colors.primary]
    : undefined;

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const handleTap = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      console.log('Haptics not available', e);
    }
    onPress();
  };

  return (
    <Animated.View style={[styles.touch, style, { transform: [{ scale }] }]}>
      {variant === 'ghost' ? (
        <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 14, padding: 1.5 }}>
          <Pressable onPress={handleTap} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.button, { backgroundColor: 'transparent' }]}>
            <Text style={[styles.buttonText, { color: colors.primary, fontFamily: 'Inter_700Bold' }, textStyle]}>{text}</Text>
          </Pressable>
        </LinearGradient>
      ) : (
        <Pressable onPress={handleTap} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ width: '100%' }}>
          <LinearGradient colors={gradientColors as string[]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { boxShadow: '0px 14px 28px rgba(2,6,23,0.22)' as any }]}>
            <View style={styles.sheen} pointerEvents="none" />
            <Text style={[styles.buttonText, { fontFamily: 'Inter_800ExtraBold' }, textStyle]}>{text}</Text>
          </LinearGradient>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: '100%',
  },
  button: {
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    opacity: 0.25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
