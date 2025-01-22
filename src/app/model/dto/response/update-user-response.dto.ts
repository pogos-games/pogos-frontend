import { Avatar } from '../../enum/avatar.enum';

export interface UpdateUserResponseDto {
    id: string;
    username: string;
    avatar: Avatar;
    nbNotifications:number
}
