
import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  makeCommonStyles,
  lightColors,
  darkColors,
  AppColors,
  glassGoldColors,
  minimalWhiteColors,
} from '../styles/commonStyles';

type Theme = 'light' | 'dark' | 'glassGold' | 'minimalWhite';

type ThemeCtx = {
  theme: Theme;
  isDark: boolean;
  colors: AppColors;
  commonStyles: ReturnType<typeof makeCommonStyles>;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);
const STORAGE_KEY = 'app_theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Default to dark to match the requested premium first impression
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light' || stored === 'glassGold' || stored === 'minimalWhite') {
          setThemeState(stored);
        }
      } catch (e) {
        console.log('Failed to load stored theme', e);
      }
    })();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    AsyncStorage.setItem(STORAGE_KEY, t).catch((e) => console.log('Failed to persist theme', e));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const order: Theme[] = ['dark', 'glassGold', 'minimalWhite', 'light'];
      const idx = order.indexOf(prev);
      return order[(idx + 1) % order.length];
    });
  }, [setTheme]);

  const colors: AppColors =
    theme === 'dark'
      ? darkColors
      : theme === 'glassGold'
      ? glassGoldColors
      : theme === 'minimalWhite'
      ? minimalWhiteColors
      : lightColors;

  const commonStyles = useMemo(() => makeCommonStyles(colors), [colors]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark' || theme === 'glassGold',
      colors,
      commonStyles,
      setTheme,
      toggleTheme,
    }),
    [theme, colors, commonStyles, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
