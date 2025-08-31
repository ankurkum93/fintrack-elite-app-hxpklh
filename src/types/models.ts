export type Expense = {
  id?: string;
  user_id?: string;
  amount: number;
  currency?: string;
  category_id?: string | null;
  date: string;
  merchant?: string;
  note?: string;
  source?: 'auto' | 'manual';
};
