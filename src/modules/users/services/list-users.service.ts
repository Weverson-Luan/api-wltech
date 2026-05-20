/**
 * IMPORTS
 */

import { toUserResponse } from '@/modules/users/mappers/user.mapper.js';
import { findAllUsersRepository } from '@/modules/users/repositories/find-all-users.repository.js';

export async function listUsersService() {
  const users = await findAllUsersRepository();
  return users.map(toUserResponse);
}
