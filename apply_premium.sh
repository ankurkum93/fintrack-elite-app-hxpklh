#!/usr/bin/env bash
set -euo pipefail

BRANCH="feat/premium-ui-and-features"
REMOTE="origin"

echo "==> Make sure you have a clean working tree (stash or commit changes)."
read -p "Proceed and create branch '$BRANCH' in current repo? (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted by user."
  exit 1
fi

echo "==> Creating and switching to branch $BRANCH"
git fetch "$REMOTE"
git checkout -b "$BRANCH"

echo "==> Writing files. (This will overwrite some existing files.)"

# ----------------------------
# package.json
# ----------------------------
cat > package.json <<'JSON'
{
  "name": "fintrack-elite",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "dev": "EXPO_NO_TELEMETRY=1 expo start --tunnel",
    "android": "EXPO_NO_TELEMETRY=1 expo start --android",
    "ios": "EXPO_NO_TELEMETRY=1 expo start --ios",
    "web": "EXPO_NO_TELEMETRY=1 expo start --web",
    "build:web": "expo export -p web && npx workbox generateSW workbox-config.js",
    "build:android": "expo prebuild -p android",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "jest"
  },
  "dependencies": {
    "@babel/runtime": "^7.26.9",
    "@expo-google-fonts/inter": "^0.4.1",
    "@expo/config-plugins": "~10.0.2",
    "@expo/metro-runtime": "~5.0.4",
    "@expo/vector-icons": "^14.1.0",
    "@gorhom/bottom-sheet": "^5.2.4",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-native-community/datetimepicker": "^8.3.0",
    "@react-navigation/drawer": "^7.1.1",
    "@react-navigation/native": "^7.0.14",
    "@react-navigation/native-stack": "^7.2.0",
    "expo": "~53.0.9",
    "expo-blur": "^14.1.4",
    "expo-constants": "~17.1.6",
    "expo-font": "^13.3.1",
    "expo-haptics": "^14.1.4",
    "expo-image-picker": "^16.1.4",
    "expo-linear-gradient": "^14.1.4",
    "expo-linking": "^7.1.4",
    "expo-router": "^5.0.7",
    "expo-splash-screen": "^0.30.8",
    "expo-status-bar": "~2.2.3",
    "expo-system-ui": "^5.0.7",
    "expo-web-browser": "^14.1.6",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.2",
    "react-native-gesture-handler": "^2.24.0",
    "react-native-reanimated": "~3.17.5",
    "react-native-safe-area-context": "^5.4.0",
    "react-native-screens": "~4.10.0",
    "react-native-svg": "^15.12.1",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-web": "~0.20.0",
    "react-native-webview": "^13.13.5",
    "victory-native": "^37.1.4",
    "@supabase/supabase-js": "^2.43.4",
    "expo-linear-gradient": "~13.0.0",
    "expo-haptics": "~12.0.0",
    "react-native-modal": "^13.0.1",
    "react-native-animated-pagination-dots": "^2.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@eslint/js": "^9.19.0",
    "@testing-library/react-native": "^12.4.5",
    "@types/react": "~19.0.14",
    "@types/jest": "^29.5.12",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "babel-plugin-module-resolver": "^5.0.2",
    "eslint": "^8.57.0",
    "eslint-config-expo": "~9.2.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-react": "^7.37.4",
    "globals": "^15.14.0",
    "jest": "^29.7.0",
    "typescript": "^5.8.3",
    "webpack-cli": "^6.0.1"
  },
  "resolutions": {
    "@expo/prebuild-config": "latest"
  },
  "private": true
}
JSON

# ----------------------------
# tsconfig.json
# ----------------------------
cat > tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/screens/*": ["screens/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["src"]
}
TS

# ----------------------------
# babel.config.js
# ----------------------------
cat > babel.config.js <<'BABEL'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src'
        }
      }],
      'react-native-reanimated/plugin'
    ]
  };
};
BABEL

# ----------------------------
# .env.example
# ----------------------------
cat > .env.example <<'ENV'
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_API_KEY=
EXPO_PUBLIC_APP_NAME=FinTrack Elite
ENV

# ----------------------------
# src/App.tsx
# ----------------------------
mkdir -p src
cat > src/App.tsx <<'APP'
import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);
const queryClient = new QueryClient();

export default function App() {
  const scheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
APP

# ----------------------------
# src/navigation/RootNavigator.tsx
# ----------------------------
mkdir -p src/navigation
cat > src/navigation/RootNavigator.tsx <<'NAV'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '@/screens/Dashboard';
import Transactions from '@/screens/Transactions';
import AddExpense from '@/screens/AddExpense';
import Analytics from '@/screens/Analytics';
import Settings from '@/screens/Settings';
import Onboarding from '@/screens/Onboarding';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Add" component={AddExpense} options={{ title: 'Add' }} />
      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
NAV

# ----------------------------
# src/components/Card.tsx
# ----------------------------
mkdir -p src/components
cat > src/components/Card.tsx <<'CARD'
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export default function Card({ children, style, ...rest }: ViewProps & { children?: any }) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
});
CARD

# ----------------------------
# src/screens/Onboarding.tsx
# ----------------------------
mkdir -p src/screens
cat > src/screens/Onboarding.tsx <<'ONB'
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const nav = useNavigation<any>();

  return (
    <LinearGradient colors={['#0B132B', '#1C1C1C']} style={s.container}>
      <PagerView style={{ flex: 1 }} initialPage={0}>
        <View key="1" style={s.page}>
          <Text style={s.title}>Track automatically. Spend smarter.</Text>
          <Text style={s.body}>Auto-capture expenses from notifications and bank sync.</Text>
        </View>

        <View key="2" style={s.page}>
          <Text style={s.title}>See insights. Predict the future.</Text>
          <Text style={s.body}>Smart charts & forecasts to help you plan ahead.</Text>
        </View>

        <View key="3" style={s.page}>
          <Text style={s.title}>Your finances, secured.</Text>
          <Text style={s.body}>Face ID & biometric security to safeguard your data.</Text>
          <TouchableOpacity style={s.cta} onPress={() => nav.navigate('Main')}>
            <Text style={s.ctaText}>Start 14-day Premium Trial</Text>
          </TouchableOpacity>
        </View>
      </PagerView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 80 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  body: { color: '#bfc8d6', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  cta: { marginTop: 20, backgroundColor: '#F1C40F', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 28 },
  ctaText: { fontWeight: '700' },
});
ONB

# ----------------------------
# src/screens/Dashboard.tsx
# ----------------------------
cat > src/screens/Dashboard.tsx <<'DSH'
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Card from '@/components/Card';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Dashboard() {
  const nav = useNavigation<any>();
  function onAdd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.navigate('Add');
  }

  return (
    <View style={s.container}>
      <Text style={s.greet}>Good evening, Ankur 👋</Text>

      <Card>
        <Text style={s.cardTitle}>Current balance</Text>
        <Text style={s.balance}>€ 16,450</Text>
      </Card>

      <Card>
        <Text style={s.cardTitle}>Today’s Spend</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.large}>€ 2,500</Text>
          <View>
            <Text style={{ color: '#bfc8d6' }}>Animated bar here</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={s.cardTitle}>This Week’s Budget Progress</Text>
        <View style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={s.large}>70%</Text>
        </View>
      </Card>

      <Card>
        <Text style={s.cardTitle}>AI Insight of the Day</Text>
        <Text style={s.body}>Dining spend is 20% higher this week. Want to set a dining cap?</Text>
        <TouchableOpacity style={s.setLimit}>
          <Text style={{ fontWeight: '700' }}>Set Limit</Text>
        </TouchableOpacity>
      </Card>

      <TouchableOpacity style={s.fab} onPress={onAdd}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  greet: { fontSize: 20, color: '#fff', marginBottom: 12 },
  cardTitle: { fontWeight: '700', color: '#cbd5e1', marginBottom: 8 },
  balance: { fontSize: 36, fontWeight: '800', color: '#fff' },
  large: { fontSize: 24, fontWeight: '700', color: '#fff' },
  body: { color: '#bfc8d6', marginTop: 8 },
  setLimit: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#00D9D9', borderRadius: 12, alignSelf: 'flex-start' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D9D9',
    shadowRadius: 10,
    elevation: 8,
  },
});
DSH

# ----------------------------
# src/screens/Transactions.tsx
# ----------------------------
cat > src/screens/Transactions.tsx <<'TRX'
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '@/components/Card';

const sample = [
  { id: '1', merchant: 'Starbucks', amount: 4.5, source: 'auto' },
  { id: '2', merchant: 'Uber', amount: 12.3, source: 'manual' },
  { id: '3', merchant: 'Amazon', amount: 49.99, source: 'auto' },
];

export default function Transactions() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Transactions</Text>
      <FlatList
        data={sample}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={{ paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#fff' }}>{item.merchant}</Text>
              <Text style={{ color: '#fff' }}>€ {item.amount}</Text>
            </View>
            <Text style={{ color: '#bfc8d6', marginTop: 6 }}>{item.source === 'auto' ? 'Auto-detected 💡' : 'Manually added ✏️'}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { color: '#fff', fontSize: 22, marginBottom: 12 },
});
TRX

# ----------------------------
# src/screens/AddExpense.tsx
# ----------------------------
cat > src/screens/AddExpense.tsx <<'ADD'
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createExpense as apiCreateExpense } from '@/services/api';

export default function AddExpense({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');

  async function onSave() {
    await apiCreateExpense({ amount: Number(amount || 0), merchant, source: 'manual', date: new Date().toISOString() });
    navigation.goBack();
  }

  return (
    <View style={s.container}>
      <Text style={s.label}>Amount</Text>
      <TextInput keyboardType="numeric" style={s.input} value={amount} onChangeText={setAmount} placeholder="0.00" />
      <Text style={s.label}>Merchant</Text>
      <TextInput style={s.input} value={merchant} onChangeText={setMerchant} />
      <TouchableOpacity style={s.receipt}>
        <Text style={{ color: '#fff' }}>Upload Receipt (OCR)</Text>
      </TouchableOpacity>
      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 0, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, color: '#fff', marginBottom: 12 },
  label: { color: '#cbd5e1', marginBottom: 6 },
  receipt: { padding: 12, backgroundColor: '#2ECC71', borderRadius: 12, marginVertical: 12, alignItems: 'center' },
});
ADD

# ----------------------------
# src/screens/Analytics.tsx
# ----------------------------
cat > src/screens/Analytics.tsx <<'ANL'
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import Card from '@/components/Card';

export default function Analytics() {
  const data = [{ x: 'Food', y: 40 }, { x: 'Travel', y: 25 }, { x: 'Shop', y: 35 }];
  return (
    <View style={s.container}>
      <Card>
        <VictoryPie animate={{ duration: 800 }} data={data} />
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 } });
ANL

# ----------------------------
# src/screens/Budget.tsx
# ----------------------------
cat > src/screens/Budget.tsx <<'BUD'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/Card';

export default function Budget() {
  return (
    <View style={s.container}>
      <Card>
        <Text style={{ fontWeight: '700', color: '#fff' }}>Budget Overview</Text>
        <Text style={{ color: '#bfc8d6', marginTop: 8 }}>Radial chart with glowing segments</Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 } });
BUD

# ----------------------------
# src/screens/Settings.tsx
# ----------------------------
cat > src/screens/Settings.tsx <<'SET'
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Card from '@/components/Card';

export default function Settings() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Settings</Text>
      <Card>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Theme</Text>
        <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
          <Text style={{ color: '#bfc8d6' }}>Classic Dark</Text>
          <Switch value />
        </View>
      </Card>

      <Card>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Security</Text>
        <Text style={{ color: '#bfc8d6', marginTop: 8 }}>Enable App Lock / Biometrics</Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { color: '#fff', fontSize: 22, marginBottom: 12 } });
SET

# ----------------------------
# src/services/supabase.ts
# ----------------------------
mkdir -p src/services
cat > src/services/supabase.ts <<'SUPA'
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);
SUPA

# ----------------------------
# src/services/api.ts
# ----------------------------
cat > src/services/api.ts <<'API'
import { supabase } from './supabase';
import { Expense } from '@/types/models';

export async function listExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data as any;
}

export async function createExpense(payload: Partial<Expense>) {
  const { data, error } = await supabase.from('expenses').insert(payload).select().single();
  if (error) throw error;
  return data;
}
API

# ----------------------------
# src/types/models.ts
# ----------------------------
mkdir -p src/types
cat > src/types/models.ts <<'TYPES'
export type Expense = {
  id?: string;
  user_id?: string;
  amount: number;
  currency?: string;
  category_id?: string | null;
  date: string;
  merchant?: string;
  note?: string;
  source?: 'auto' | 'manual';
};
TYPES

echo "==> Files written."

echo "==> Staging changes..."
git add -A

echo "==> Commit message:"
git commit -m "feat: premium UI skeleton — onboarding, dashboard, transactions, add/edit, analytics, budget, settings, supabase wiring, package.json update"

echo "==> Pushing branch to remote '$REMOTE'..."
git push -u "$REMOTE" "$BRANCH"

echo "==> Done. Branch pushed: $BRANCH"
echo "Next steps:"
echo "  1) Run: npm ci"
echo "  2) Run: npm run dev"
echo "  3) Test onboarding -> dashboard -> add expense flows"
echo ""
echo "If you want, I can now produce a PR description + checklist text for the GitHub PR."
