import { UserResponseDto } from './user-response.dto';

export interface FriendshipResponseDto {
    id: string;
    user: UserResponseDto;
}
