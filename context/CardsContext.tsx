
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardBrand = 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Other';
export type CardType = 'credit' | 'debit';

export type Card = {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  nickname?: string;
  type: CardType;
  addedAt: string; // ISO
};

export type AddCardPayload = {
  holder: string;
  number: string; // full PAN, NOT stored
  expiry: string; // MM/YY or MM/YYYY
  cvv?: string; // NOT stored
  nickname?: string;
  type: CardType;
};

type CardsCtx = {
  cards: Card[];
  addCard: (payload: AddCardPayload) => Card | null;
  deleteCard: (id: string) => void;
};

const STORAGE_KEY = 'cards_v1';
const CardsContext = createContext<CardsCtx | undefined>(undefined);

function detectBrand(num: string): CardBrand {
  const n = num.replace(/\D/g, '');
  if (/^4\d{0,}$/.test(n)) return 'Visa';
  if (/^5[1-5]\d{0,}$/.test(n) || /^2(2[2-9]|[3-6]\d|7[01])\d{0,}$/.test(n)) return 'Mastercard';
  if (/^3[47]\d{0,}$/.test(n)) return 'Amex';
  if (/^6(011|5|4[4-9])\d{0,}$/.test(n)) return 'Discover';
  return 'Other';
}

function luhnCheck(num: string): boolean {
  const n = num.replace(/\D/g, '');
  if (n.length < 13) return false;
  let sum = 0;
  let dbl = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function parseExpiry(expiry: string): { month: number; year: number } | null {
  const cleaned = expiry.trim();
  const m = cleaned.match(/^(\d{1,2})\s*\/\s*(\d{2,4})$/);
  if (!m) return null;
  let month = parseInt(m[1], 10);
  let year = parseInt(m[2], 10);
  if (month < 1 || month > 12) return null;
  if (year < 100) {
    year = 2000 + year;
  }
  return { month, year };
}

export const CardsProvider = ({ children }: { children: React.ReactNode }) => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setCards(parsed);
        }
      } catch (e) {
        console.log('Failed to load cards', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards)).catch((e) => console.log('Persist cards failed', e));
  }, [cards]);

  const addCard = useCallback((payload: AddCardPayload): Card | null => {
    const num = payload.number.replace(/\s/g, '');
    if (!luhnCheck(num)) {
      console.log('Invalid card number');
      return null;
    }
    const exp = parseExpiry(payload.expiry);
    if (!exp) {
      console.log('Invalid expiry');
      return null;
    }
    // Expiration not in the past
    const now = new Date();
    const lastDate = new Date(exp.year, exp.month - 1, 1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    if (lastDate <= now) {
      console.log('Card expired');
      return null;
    }
    const brand = detectBrand(num);
    const last4 = num.slice(-4);

    const card: Card = {
      id: Math.random().toString(36).slice(2),
      brand,
      last4,
      expMonth: exp.month,
      expYear: exp.year,
      holder: payload.holder.trim(),
      nickname: payload.nickname?.trim() || undefined,
      type: payload.type,
      addedAt: new Date().toISOString(),
    };
    setCards((prev) => [card, ...prev]);
    return card;
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo(() => ({ cards, addCard, deleteCard }), [cards, addCard, deleteCard]);

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};

export const useCards = () => {
  const ctx = useContext(CardsContext);
  if (!ctx) throw new Error('useCards must be used within CardsProvider');
  return ctx;
};
