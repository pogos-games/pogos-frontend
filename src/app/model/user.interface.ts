import { Avatar } from './enum/avatar.enum';

export interface User {
    id: string,
    pseudo: string,
    mail: string,
    avatar: Avatar,
    nbNotifications: number,
    accessToken: string
}
