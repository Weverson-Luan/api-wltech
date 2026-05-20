import type { UserResponseDto } from '@/modules/users/dtos/user-response.dto.js';
import type { UserListItem, UserWithRole } from '@/modules/users/types/user.types.js';

export function toUserResponse(user: UserWithRole | UserListItem): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role_id,
    role_name: user.role_name,
    created_at: user.created_at,
    ...('updated_at' in user ? { updated_at: user.updated_at } : {}),
  };
}
