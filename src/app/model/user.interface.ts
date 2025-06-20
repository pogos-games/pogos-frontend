import { Avatar } from './dto/game/enum/avatar.enum';

export interface User {
    id: string,
    pseudo: string,
    mail: string,
    avatar: Avatar,
    nbNotifications: number,
    accessToken: string
}
