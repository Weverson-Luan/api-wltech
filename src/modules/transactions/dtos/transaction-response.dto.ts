export type TransactionResponseDto = {
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
