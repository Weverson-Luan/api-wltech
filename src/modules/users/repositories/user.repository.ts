import type { CreateUserRepositoryInput, UpdateUserRepositoryInput } from '@/modules/users/types/user.types.js';
import { createUserRepository } from '@/modules/users/repositories/create-user.repository.js';
import { deleteUserRepository } from '@/modules/users/repositories/delete-user.repository.js';
import { findAllUsersRepository } from '@/modules/users/repositories/find-all-users.repository.js';
import { findRoleByIdRepository } from '@/modules/users/repositories/find-role-by-id.repository.js';
import { findRoleIdByNameRepository } from '@/modules/users/repositories/find-role-id-by-name.repository.js';
import { findUserByEmailRepository } from '@/modules/users/repositories/find-user-by-email.repository.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';
import { updateUserRepository } from '@/modules/users/repositories/update-user.repository.js';

/**
 * Facade para uso entre módulos quando necessário.
 */
export class UserRepository {
  findAll = findAllUsersRepository;
  findById = findUserByIdRepository;
  findByEmail = findUserByEmailRepository;
  findRoleById = findRoleByIdRepository;
  findRoleIdByName = findRoleIdByNameRepository;
  create = (input: CreateUserRepositoryInput) => createUserRepository(input);
  update = (id: number, input: UpdateUserRepositoryInput) => updateUserRepository(id, input);
  delete = deleteUserRepository;
}
