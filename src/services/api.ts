import { supabase } from './supabase';
import { Expense } from '@/types/models';

export async function listExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data as any;
}

export async function createExpense(payload: Partial<Expense>) {
  const { data, error } = await supabase.from('expenses').insert(payload).select().single();
  if (error) throw error;
  return data;
}
