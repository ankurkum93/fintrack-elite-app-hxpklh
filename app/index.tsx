
import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Redirect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import BackdropGradient from '../components/BackdropGradient';

const ONBOARD_KEY = 'has_onboarded';

export default function Entry() {
  const [checked, setChecked] = useState(false);
  const [shouldOnboard, setShouldOnboard] = useState(false);
  const { commonStyles, colors } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(ONBOARD_KEY);
        const needs = v !== 'true';
        setShouldOnboard(needs);
        setChecked(true);
        Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      } catch (e) {
        console.log('Onboard check failed', e);
        setChecked(true);
      }
    })();
  }, [fade]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(wave, { toValue: 1, duration: 6000, useNativeDriver: true })
    ).start();
  }, [glow, wave]);

  if (!checked) return null;
  if (!shouldOnboard) return <Redirect href="/(tabs)" />;

  const translateX = wave.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });

  return (
    <Animated.View style={[commonStyles.container, { opacity: fade }]}>
      <View style={{ position: 'absolute', inset: 0 }}>
        <BackdropGradient variant="auth" intensity={1} />
        <Animated.View style={{ position: 'absolute', bottom: -120, left: -60, right: -60, transform: [{ translateX }] }}>
          <LinearGradient
            colors={[colors.backgroundAlt, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.8 }}
            style={{ height: 320, borderTopLeftRadius: 160, borderTopRightRadius: 160, opacity: 0.2, boxShadow: '0 40px 120px rgba(2,6,23,0.25)' as any }}
          />
        </Animated.View>
      </View>
      <View style={[commonStyles.content, { paddingHorizontal: 20 }]}>
        <Animated.View
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.backgroundAlt,
            boxShadow: '0 22px 44px rgba(2,6,23,0.26)' as any,
            transform: [
              {
                scale: glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }),
              },
            ],
          }}
        >
          <Image source={require('../assets/images/final_quest_240x240.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
        </Animated.View>
        <Text style={[commonStyles.title, { marginTop: 18 }]}>Finance Tracker App</Text>
        <Text style={[commonStyles.text, { maxWidth: 320, opacity: 0.9, textAlign: 'center' }]}>Track automatically. Spend smarter.</Text>
        <View style={commonStyles.buttonContainer}>
          <Button text="Get Started" onPress={() => router.push('/onboarding')} />
        </View>
      </View>
    </Animated.View>
  );
}
