export type UserResponseDto = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  created_at: Date;
  updated_at?: Date;
};
