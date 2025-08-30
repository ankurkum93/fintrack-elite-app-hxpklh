
import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionsContext';
import BackdropGradient from '../../components/BackdropGradient';

export default function SettingsScreen() {
  const { commonStyles, colors, theme, toggleTheme } = useTheme();
  const { transactions } = useTransactions();

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <BackdropGradient intensity={0.75} />
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'left' }]}>Settings</Text>
      </View>

      <View style={[commonStyles.card, { marginTop: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[commonStyles.text]}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
            trackColor={{ true: colors.accent, false: colors.grey }}
          />
        </View>
      </View>

      <View style={[commonStyles.card, { marginTop: 12 }]}>
        <Text style={[commonStyles.text, { marginBottom: 6 }]}>About</Text>
        <Text style={[commonStyles.text, { opacity: 0.7 }]}>Transactions stored locally: {transactions.length}</Text>
        <Text style={[commonStyles.text, { opacity: 0.7, marginTop: 6 }]}>
          Premium analytics and auto-tracking are coming soon.
        </Text>
      </View>
    </View>
  );
}
