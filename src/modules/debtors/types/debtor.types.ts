export type DebtorRecord = {
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

export type CreateDebtorRepositoryInput = {
  uuid?: string;
  name: string;
  description: string;
  amount: number;
  principal_amount: number;
  due_date: Date;
  status: string;
  user_id_applicant: number;
  user_id_owner: number;
};

export type UpdateDebtorRepositoryInput = {
  name?: string;
  description?: string;
  amount?: number;
  principal_amount?: number;
  due_date?: Date;
  status?: string;
  user_id_applicant?: number;
  user_id_owner?: number;
  updated_at: Date;
};
