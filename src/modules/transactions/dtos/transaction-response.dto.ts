export type TransactionResponseDto = {
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
