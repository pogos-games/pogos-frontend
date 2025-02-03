import { NotificationType } from "../../enum/notifications-type.enum";
import { UserResponseDto } from "./user-response.dto";

export interface NotificationsResponseDto {
    id: string;
    message: string;
    type: NotificationType;
    requestId: string;
    sender: UserResponseDto;
}
