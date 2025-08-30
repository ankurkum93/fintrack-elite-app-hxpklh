
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  name: string;
  email?: string;
  premiumUntil?: string; // ISO date
  notificationGranted?: boolean;
  linkedAccounts?: boolean;
};

type UserCtx = {
  user: User;
  setName: (name: string) => void;
  setEmail: (email?: string) => void;
  startTrial: (days?: number) => void;
  endTrial: () => void;
  isPremium: boolean;
  setNotificationGranted: (v: boolean) => void;
  setLinkedAccounts: (v: boolean) => void;
};

const STORAGE_KEY = 'user_profile_v1';
const defaultUser: User = { name: 'Guest' };

const UserContext = createContext<UserCtx | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') setUser(parsed);
        }
      } catch (e) {
        console.log('Load user failed', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user)).catch((e) => console.log('Persist user failed', e));
  }, [user]);

  const setName = useCallback((name: string) => setUser((u) => ({ ...u, name })), []);
  const setEmail = useCallback((email?: string) => setUser((u) => ({ ...u, email })), []);
  const setNotificationGranted = useCallback((v: boolean) => setUser((u) => ({ ...u, notificationGranted: v })), []);
  const setLinkedAccounts = useCallback((v: boolean) => setUser((u) => ({ ...u, linkedAccounts: v })), []);

  const startTrial = useCallback((days = 14) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    setUser((u) => ({ ...u, premiumUntil: until.toISOString() }));
  }, []);

  const endTrial = useCallback(() => {
    setUser((u) => ({ ...u, premiumUntil: undefined }));
  }, []);

  const isPremium = useMemo(() => {
    if (!user.premiumUntil) return false;
    return new Date(user.premiumUntil) > new Date();
  }, [user.premiumUntil]);

  const value = useMemo(
    () => ({
      user,
      setName,
      setEmail,
      startTrial,
      endTrial,
      isPremium,
      setNotificationGranted,
      setLinkedAccounts,
    }),
    [user, setName, setEmail, startTrial, endTrial, isPremium, setNotificationGranted, setLinkedAccounts]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
