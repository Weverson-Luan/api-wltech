import type { UserResponseDto } from '@/modules/users/dtos/user-response.dto.js';

export type AuthSessionDataDto = {
  access_token: string;
  user: UserResponseDto;
};
