
import React, { useRef } from 'react';
import { Text, StyleSheet, View, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  return (
    <Animated.View style={[styles.touch, style, { transform: [{ scale }] }]}>
      {variant === 'ghost' ? (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }]}>
          <Text style={[styles.buttonText, { color: colors.primary }, textStyle]}>{text}</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ width: '100%' }}>
          <LinearGradient colors={gradientColors as string[]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { boxShadow: '0px 10px 24px rgba(2,6,23,0.18)' as any }]}>
            <Text style={[styles.buttonText, textStyle]}>{text}</Text>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
