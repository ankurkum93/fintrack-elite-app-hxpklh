
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import BackdropGradient from '../../components/BackdropGradient';
import Button from '../../components/Button';
import { useCards } from '../../context/CardsContext';
import CardPreview from '../../components/CardPreview';
import Icon from '../../components/Icon';
import { router } from 'expo-router';
import GlassCard from '../../components/GlassCard';

export default function CardsScreen() {
  const { commonStyles, colors } = useTheme();
  const { cards, deleteCard } = useCards();

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 16 }]}>
      <BackdropGradient intensity={0.9} />
      <View style={{ marginTop: 12 }}>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'left' }]}>Cards</Text>
      </View>

      <GlassCard style={{ marginTop: 12 }}>
        <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 6 }]}>
          Store your cards securely. We only save last 4 digits and expiry locally on your device.
        </Text>
        <Button text="Add Card" onPress={() => router.push('/add-card')} />
      </GlassCard>

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {cards.map((c) => (
          <CardPreview
            key={c.id}
            card={c}
            right={
              <TouchableOpacity
                onPress={() => deleteCard(c.id)}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>Delete</Text>
              </TouchableOpacity>
            }
          />
        ))}
        {cards.length === 0 ? (
          <Text style={[commonStyles.text, { textAlign: 'center', opacity: 0.7, marginTop: 20 }]}>
            No cards added yet.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
