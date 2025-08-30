
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Animated, TextInput, TouchableOpacity, Platform } from 'react-native';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import BackdropGradient from '../components/BackdropGradient';
import GlassCard from '../components/GlassCard';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');
const ONBOARD_KEY = 'has_onboarded';

type Slide = {
  title: string;
  subtitle: string;
  art: 'coins' | 'charts' | 'lock';
};

const slides: Slide[] = [
  { title: 'Track automatically. Spend smarter.', subtitle: 'Let your wallet breathe again.', art: 'coins' },
  { title: 'See insights. Predict the future.', subtitle: 'Beautiful charts and trends.', art: 'charts' },
  { title: 'Your finances, secured.', subtitle: 'Biometric lock and privacy-first.', art: 'lock' },
];

function CoinsArt({ progress }: { progress: Animated.Value }) {
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [12, -12] });
  return (
    <View style={{ height: 160, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ translateY }], flexDirection: 'row' }}>
        <Text style={{ fontSize: 48 }}>🪙🪙</Text>
        <Text style={{ fontSize: 48, marginLeft: 6 }}>👛</Text>
      </Animated.View>
    </View>
  );
}

function ChartsArt({ progress }: { progress: Animated.Value }) {
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  return (
    <View style={{ height: 160, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale }], flexDirection: 'row', alignItems: 'flex-end' }}>
        <View style={{ width: 18, height: 36, backgroundColor: '#10B981', borderRadius: 6, marginHorizontal: 4 }} />
        <View style={{ width: 18, height: 56, backgroundColor: '#22C55E', borderRadius: 6, marginHorizontal: 4 }} />
        <View style={{ width: 18, height: 84, backgroundColor: '#D4AF37', borderRadius: 6, marginHorizontal: 4 }} />
      </Animated.View>
    </View>
  );
}

function LockArt({ progress }: { progress: Animated.Value }) {
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] });
  return (
    <View style={{ height: 160, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ rotate }], alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64 }}>🔒</Text>
        <Text style={{ fontSize: 18, marginTop: 6 }}>Face ID</Text>
      </Animated.View>
    </View>
  );
}

export default function Onboarding() {
  const { commonStyles, colors } = useTheme();
  const { user, setName, setEmail, startTrial, setNotificationGranted, setLinkedAccounts } = useUser();

  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const artProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(artProgress, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(artProgress, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [artProgress]);

  const handleNext = () => {
    if (idx < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (idx + 1) * width, animated: true });
      setIdx(idx + 1);
    }
  };

  const complete = async () => {
    await AsyncStorage.setItem(ONBOARD_KEY, 'true');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  const startTrialAndContinue = async () => {
    startTrial(14);
    await complete();
  };

  const SlideArt = useMemo(() => {
    const s = slides[idx];
    if (s.art === 'coins') return <CoinsArt progress={artProgress} />;
    if (s.art === 'charts') return <ChartsArt progress={artProgress} />;
    return <LockArt progress={artProgress} />;
  }, [idx, artProgress]);

  return (
    <View style={[commonStyles.container]}>
      <BackdropGradient variant="auth" intensity={1} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIdx(i);
        }}
        style={{ flexGrow: 0 }}
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width, paddingHorizontal: 20, paddingTop: 24 }}>
            <LinearGradient colors={[colors.backgroundAlt, colors.background]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: '100%', borderRadius: 20, padding: 16 }}>
              <Text style={[commonStyles.title, { fontSize: 26, textAlign: 'left' }]}>{s.title}</Text>
              <Text style={[commonStyles.text, { marginBottom: 16, textAlign: 'left', opacity: 0.9 }]}>{s.subtitle}</Text>
              {i === idx ? SlideArt : null}
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                {slides.map((_, j) => (
                  <View key={j} style={{ width: 8, height: 8, borderRadius: 8, marginRight: 6, backgroundColor: j === idx ? colors.accent : 'rgba(148,163,184,0.4)' }} />
                ))}
              </View>
              <View style={{ height: 8 }} />
              {i < slides.length - 1 ? <Button text="Next" onPress={handleNext} /> : null}
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20 }}>
        <GlassCard>
          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 6 }]}>Create your profile</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor={colors.grey}
            value={user.name}
            onChangeText={(t) => setName(t)}
            autoCapitalize="words"
            style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
          />
          <View style={{ height: 8 }} />
          <TextInput
            placeholder="Email (optional)"
            placeholderTextColor={colors.grey}
            value={user.email || ''}
            onChangeText={(t) => setEmail(t || undefined)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: 'transparent', color: colors.text, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.18)' }}
          />
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[commonStyles.text, { marginBottom: 10, textAlign: 'left' }]}>Sign in with</Text>
          <View style={{ flexDirection: 'row', columnGap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button text="Apple" onPress={() => console.log('Apple login placeholder')} />
            </View>
            <View style={{ flex: 1 }}>
              <Button text="Google" onPress={() => console.log('Google login placeholder')} variant="secondary" />
            </View>
          </View>
          <Text style={[commonStyles.text, { marginTop: 10, opacity: 0.7, textAlign: 'left' }]}>Or continue with Email above.</Text>
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[commonStyles.text, { textAlign: 'left' }]}>Start with 14 days Premium → Unlock AI insights & unlimited tracking.</Text>
          <Button text="Start 14-day Premium Trial" onPress={startTrialAndContinue} />
          <View style={{ height: 6 }} />
          <Button text="Continue without trial" onPress={complete} variant="ghost" />
        </GlassCard>

        <GlassCard style={{ marginTop: 12 }}>
          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 6 }]}>Permissions</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[commonStyles.text, { marginBottom: 0 }]}>Notifications</Text>
            <TouchableOpacity
              onPress={() => setNotificationGranted(!(!!user.notificationGranted))}
              style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: user.notificationGranted ? colors.accent : 'transparent', borderWidth: user.notificationGranted ? 0 : 1, borderColor: 'rgba(148,163,184,0.18)' }}
            >
              <Text style={{ color: user.notificationGranted ? '#fff' : colors.text, fontWeight: '800' }}>{user.notificationGranted ? 'Granted' : 'Ask Later'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[commonStyles.text, { marginBottom: 0 }]}>Account linking</Text>
            <TouchableOpacity
              onPress={() => setLinkedAccounts(!(!!user.linkedAccounts))}
              style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: user.linkedAccounts ? colors.accent : 'transparent', borderWidth: user.linkedAccounts ? 0 : 1, borderColor: 'rgba(148,163,184,0.18)' }}
            >
              <Text style={{ color: user.linkedAccounts ? '#fff' : colors.text, fontWeight: '800' }}>{user.linkedAccounts ? 'Enabled' : 'Later'}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <View style={{ height: 20 }} />
      </View>

      <View style={{ alignItems: 'center', paddingBottom: 10 }}>
        <Icon name="shield-checkmark-outline" size={22} color={colors.grey} />
        <Text style={[commonStyles.text, { fontSize: 12, color: colors.grey, marginTop: 6 }]}>You can manage permissions anytime in Settings.</Text>
      </View>
    </View>
  );
}
