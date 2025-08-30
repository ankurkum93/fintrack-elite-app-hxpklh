
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';

const ONBOARD_KEY = 'has_onboarded';

export default function Onboarding() {
  const { commonStyles, colors, toggleTheme } = useTheme();

  useEffect(() => {
    console.log('Onboarding mounted');
  }, []);

  const complete = async () => {
    await AsyncStorage.setItem(ONBOARD_KEY, 'true');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 20 }]}>
      <LinearGradient colors={[colors.backgroundAlt, colors.background]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: '100%', borderRadius: 20, padding: 16 }}>
        <Text style={[commonStyles.title, { fontSize: 28, textAlign: 'left' }]}>Welcome</Text>
        <Text style={[commonStyles.text, { marginBottom: 20, textAlign: 'left' }]}>Sign in to sync (optional), or continue locally. You can switch theme anytime.</Text>

        <View style={[commonStyles.card, { marginTop: 12 }]}>
          <Text style={[commonStyles.text, { marginBottom: 10 }]}>Sign in with</Text>
          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button text="Apple" onPress={() => console.log('Apple login placeholder')} />
            </View>
            <View style={{ flex: 1 }}>
              <Button text="Google" onPress={() => console.log('Google login placeholder')} variant="secondary" />
            </View>
          </View>
          <Text style={[commonStyles.text, { marginTop: 10, opacity: 0.7 }]}>Authentication is optional in this version.</Text>
        </View>

        <View style={[commonStyles.card, { marginTop: 12 }]}>
          <Text style={[commonStyles.text, { marginBottom: 10 }]}>Theme</Text>
          <Button text="Toggle Dark/Light" onPress={toggleTheme} variant="ghost" />
        </View>

        <View style={{ height: 20 }} />

        <Button text="Continue" onPress={complete} />
      </LinearGradient>

      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <Icon name="shield-checkmark-outline" size={22} color={colors.grey} />
        <Text style={[commonStyles.text, { fontSize: 12, color: colors.grey, marginTop: 6 }]}>Permissions and privacy controls are in Settings.</Text>
      </View>
    </View>
  );
}
