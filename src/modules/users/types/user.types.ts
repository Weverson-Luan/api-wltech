export type UserWithRole = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
  role_name: string;
  created_at: Date;
  updated_at: Date;
};

export type UserListItem = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  created_at: Date;
};

export type CreateUserRepositoryInput = {
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
};

export type UpdateUserRepositoryInput = {
  name?: string;
  email?: string;
  password_hash?: string;
  role_id?: number;
  updated_at: Date;
};
