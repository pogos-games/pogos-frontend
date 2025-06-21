import { Avatar } from '../game/enum/avatar.enum';

export interface UpdateUserRequestDto {
    username: string;
    avatar: Avatar;
}
