export type DebtorResponseDto = {
  id: number;
  uuid: string | null;
  name: string;
  description: string;
  amount: number;
  principal_amount: number;
  due_date: Date;
  status: string;
  user_id_applicant: number;
  user_id_owner: number;
  created_at: Date;
  updated_at: Date;
};
