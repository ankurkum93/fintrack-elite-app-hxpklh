
import { Tabs } from 'expo-router';
import Icon from '../../components/Icon';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: 'transparent',
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: 16,
          paddingBottom: 6,
          paddingTop: 6,
          boxShadow: '0 10px 24px rgba(0,0,0,0.15)' as any,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => <Icon name="list-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
