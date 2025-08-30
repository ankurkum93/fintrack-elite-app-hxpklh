
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { TransactionsProvider } from '../context/TransactionsContext';
import { CardsProvider } from '../context/CardsContext';
import { UserProvider } from '../context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

const STORAGE_KEY = 'emulated_device';

function InnerLayout() {
  const actualInsets = useSafeAreaInsets();
  const [storedEmulate, setStoredEmulate] = useState<string | null>(null);
  const { isDark, commonStyles } = useTheme();

  useEffect(() => {
    setupErrorLogging();
    if (Platform.OS === 'web') {
      const params = new URLSearchParams(window.location.search);
      const emulate = params.get('emulate');
      if (emulate) {
        localStorage.setItem(STORAGE_KEY, emulate);
        setStoredEmulate(emulate);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setStoredEmulate(stored);
      }
    }
  }, []);

  let insetsToUse = actualInsets;

  if (Platform.OS === 'web') {
    const simulatedInsets = {
      ios: { top: 47, bottom: 20, left: 0, right: 0 },
      android: { top: 40, bottom: 0, left: 0, right: 0 },
    } as const;
    const deviceToEmulate = storedEmulate || undefined;
    insetsToUse = deviceToEmulate ? (simulatedInsets as any)[deviceToEmulate as keyof typeof simulatedInsets] || actualInsets : actualInsets;
  }

  return (
    <SafeAreaView style={[commonStyles.wrapper, {
      paddingTop: insetsToUse.top,
      paddingBottom: insetsToUse.bottom,
      paddingLeft: insetsToUse.left,
      paddingRight: insetsToUse.right,
    }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'default' }} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <TransactionsProvider>
              <CardsProvider>
                <InnerLayout />
              </CardsProvider>
            </TransactionsProvider>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
