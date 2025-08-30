
import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeCommonStyles, lightColors, darkColors, AppColors } from '../styles/commonStyles';

type Theme = 'light' | 'dark';

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
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
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
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const colors = theme === 'dark' ? darkColors : lightColors;
  const commonStyles = useMemo(() => makeCommonStyles(colors), [colors]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
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
