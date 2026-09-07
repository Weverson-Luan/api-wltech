export type TransactionRecord = {
  id: number;
  uuid: string | null;
  user_id: number;
  type: string;
  amount: number;
  category_id: number;
  category_name: string;
  payment_method: string;
  description: string;
  notes: string | null;
  date: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateTransactionRepositoryInput = {
  uuid?: string;
  user_id: number;
  type: string;
  amount: number;
  category_id: number;
  payment_method: string;
  description: string;
  notes?: string | null;
  date: Date;
};

export type UpdateTransactionRepositoryInput = {
  user_id?: number;
  type?: string;
  amount?: number;
  category_id?: number;
  payment_method?: string;
  description?: string;
  notes?: string | null;
  date?: Date;
  updated_at: Date;
};
