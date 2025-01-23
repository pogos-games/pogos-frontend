import { Avatar } from '../../enum/avatar.enum';

export interface UpdateUserRequestDto {
    username: string;
    avatar: Avatar;
}