import { Avatar } from '../../enum/avatar.enum';

export interface UserResponseDto {
    id: string,
    username: string,
    avatar: Avatar
}
