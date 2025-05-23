import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationsResponseDto } from '../../../model/dto/response/notifications-response.dto';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { NotificationType } from "../../../model/enum/notifications-type.enum";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './friendshipNotification.component.html',
  styleUrls: ['./friendshipNotification.component.scss']
})
export class NotificationComponent {

  // Reçoit une notification en entrée
  @Input({ required: true })
  notification!: NotificationsResponseDto;

  notificationType = NotificationType;

  @Output() accept: EventEmitter<string> = new EventEmitter<string>();
  @Output() denied: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();

  handleAccept(): void {
    this.accept.emit(this.notification.requestId);
  }

  handleDenied(): void {
    this.denied.emit(this.notification.requestId);
  }

  handleDelete(): void {
    this.delete.emit(this.notification.id);
  }

  constructor() { }
}
