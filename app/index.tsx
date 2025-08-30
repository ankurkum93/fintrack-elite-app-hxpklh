
import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Redirect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const ONBOARD_KEY = 'has_onboarded';

export default function Entry() {
  const [checked, setChecked] = useState(false);
  const [shouldOnboard, setShouldOnboard] = useState(false);
  const { commonStyles, colors } = useTheme();
  const fade = useRef(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(ONBOARD_KEY);
        const needs = v !== 'true';
        setShouldOnboard(needs);
        setChecked(true);
        Animated.timing(fade.current, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      } catch (e) {
        console.log('Onboard check failed', e);
        setChecked(true);
      }
    })();
  }, []);

  if (!checked) return null;
  if (!shouldOnboard) return <Redirect href="/(tabs)" />;

  return (
    <Animated.View style={[commonStyles.container, { opacity: fade.current }]}>
      <LinearGradient
        colors={[colors.backgroundAlt, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[commonStyles.content, { paddingHorizontal: 20, borderRadius: 20 }]}
      >
        <Image source={require('../assets/images/final_quest_240x240.png')} style={{ width: 140, height: 140 }} resizeMode="contain" />
        <Text style={[commonStyles.title, { marginTop: 12 }]}>Finance Tracker App</Text>
        <Text style={[commonStyles.text, { maxWidth: 320 }]}>Track expenses manually or automatically, visualize insights, and stay in control.</Text>
        <View style={commonStyles.buttonContainer}>
          <Button text="Get Started" onPress={() => router.push('/onboarding')} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
