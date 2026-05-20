import { db } from '@/db/index.js';
import { roles } from '@/db/schema/roles.js';
import { users } from '@/db/schema/users.js';
import type { UserListItem } from '@/modules/users/types/user.types.js';
import { userListSelect, usersJoinRoles } from '@/modules/users/repositories/shared/user.select.js';

export async function findAllUsersRepository(): Promise<UserListItem[]> {
  return db
    .select(userListSelect)
    .from(users)
    .innerJoin(roles, usersJoinRoles);
}
