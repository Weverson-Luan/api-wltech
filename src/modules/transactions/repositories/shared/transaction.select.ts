import { eq } from 'drizzle-orm';
import { categories } from '@/db/schema/categories.js';
import { transactions } from '@/db/schema/transactions.js';

export const transactionWithCategorySelect = {
  id: transactions.id,
  user_id: transactions.user_id,
  type: transactions.type,
  amount: transactions.amount,
  category_id: transactions.category_id,
  category_name: categories.name,
  payment_method: transactions.payment_method,
  date: transactions.date,
  created_at: transactions.created_at,
  updated_at: transactions.updated_at,
};

export const transactionsJoinCategories = eq(transactions.category_id, categories.id);
