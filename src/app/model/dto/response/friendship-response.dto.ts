import { UserResponseDto } from './user-response.dto';

export interface FriendshipResponseDto {
    friendshipId: string;
    user: UserResponseDto;
}
