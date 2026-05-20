import { eq } from 'drizzle-orm';
import { roles } from '@/db/schema/roles.js';
import { users } from '@/db/schema/users.js';

export const userWithRoleSelect = {
  id: users.id,
  name: users.name,
  email: users.email,
  password_hash: users.password_hash,
  role_id: users.role_id,
  role_name: roles.name,
  created_at: users.created_at,
  updated_at: users.updated_at,
};

export const userListSelect = {
  id: users.id,
  name: users.name,
  email: users.email,
  role_id: users.role_id,
  role_name: roles.name,
  created_at: users.created_at,
};

export const usersJoinRoles = eq(users.role_id, roles.id);
