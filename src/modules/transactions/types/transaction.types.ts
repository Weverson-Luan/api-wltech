export type TransactionRecord = {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  category_id: number;
  category_name: string;
  payment_method: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateTransactionRepositoryInput = {
  user_id: number;
  type: string;
  amount: number;
  category_id: number;
  payment_method: string;
  date: Date;
};

export type UpdateTransactionRepositoryInput = {
  user_id?: number;
  type?: string;
  amount?: number;
  category_id?: number;
  payment_method?: string;
  date?: Date;
  updated_at: Date;
};
