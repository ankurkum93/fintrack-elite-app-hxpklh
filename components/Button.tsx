
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
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

  return (
    <TouchableOpacity style={[styles.touch, style]} onPress={onPress} activeOpacity={0.8}>
      {variant === 'ghost' ? (
        <View style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }]}>
          <Text style={[styles.buttonText, { color: colors.primary }, textStyle]}>{text}</Text>
        </View>
      ) : (
        <LinearGradient colors={gradientColors as string[]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button]}>
          <Text style={[styles.buttonText, textStyle]}>{text}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: '100%',
  },
  button: {
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
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
