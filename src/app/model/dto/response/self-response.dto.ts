import { Avatar } from "../game/enum/avatar.enum";

export interface SelfResponseDto {
    id: string;
    username: string;
    avatar: Avatar;
    nbNotifications: number;
    points: number;
}
