
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO
  merchant?: string;
  notes?: string;
  type: 'manual' | 'auto';
};

type TxCtx = {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  balance: number;
  categories: string[];
};

const TransactionsContext = createContext<TxCtx | undefined>(undefined);
const STORAGE_KEY = 'transactions_v1';

const defaultCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

export const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setTransactions(parsed);
        } else {
          // Seed with a few sample items to make the UI feel alive
          const seed: Transaction[] = [
            { id: 's1', amount: -12.5, category: 'Food', date: new Date().toISOString(), merchant: 'Cafe Lux', type: 'manual', notes: 'Latte + croissant' },
            { id: 's2', amount: -45, category: 'Transport', date: new Date().toISOString(), merchant: 'Uber', type: 'auto' },
            { id: 's3', amount: -89.99, category: 'Shopping', date: new Date().toISOString(), merchant: 'Amazon', type: 'auto' },
            { id: 's4', amount: 1200, category: 'Other', date: new Date().toISOString(), merchant: 'Paycheck', type: 'manual', notes: 'Salary (partial demo)' },
          ];
          setTransactions(seed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        }
      } catch (e) {
        console.log('Failed to load transactions', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch((e) => console.log('Persist transactions failed', e));
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [{ ...tx, id: Math.random().toString(36).slice(2) }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } as Transaction : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const balance = useMemo(() => transactions.reduce((acc, t) => acc + t.amount, 0), [transactions]);

  const value = useMemo(
    () => ({ transactions, addTransaction, updateTransaction, deleteTransaction, balance, categories: defaultCategories }),
    [transactions, addTransaction, updateTransaction, deleteTransaction, balance]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionsProvider');
  return ctx;
};
