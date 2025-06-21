import {Component, inject, Input, Signal, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {ModalComponent} from '../modal/modal.component';
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NotificationComponent} from "../../notifications/friendshipNotification/friendshipNotification.component";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {LeaveButtonComponent} from "../leave-button/leave-button.component";
import {User} from "../../../model/user.interface";
import {UserAuthService} from "../../../services/auth/user-auth.service";
import {FriendshipService} from "../../../services/friendship.service";
import {NotificationService} from "../../../services/notification.service";
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzDividerModule,
    NzRowDirective,
    NzColDirective,
    LeaveButtonComponent,
    RouterLink,
    NzButtonComponent,
    ModalComponent,
    RouterLink,
    LeaveButtonComponent,
    NzPopoverModule,
    NotificationComponent,
    NzBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input({ required: true })
  title: string = "";

  @Input({ required: true })
  canLeave: boolean = false;

  @Input()
  leaveLink: string | undefined;

  @Input() public leaveSignal: WritableSignal<boolean> = signal(false);


  modalVisibility: Map<string, WritableSignal<boolean>> = new Map();


  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  private readonly router : Router = inject(Router);
  protected readonly notificationService : NotificationService = inject(NotificationService);
 private readonly friendshipService : FriendshipService = inject(FriendshipService);
 protected readonly themeService : ThemeService = inject(ThemeService);

  user: Signal<User> = this.userAuthService.user;

  showModal(modalId: string): void {
    if (!this.modalVisibility.has(modalId)) {
      this.modalVisibility.set(modalId, signal(false));
    }
    this.modalVisibility.get(modalId)?.set(true);
  }

  hideModal(modalId: string): void {
    this.modalVisibility.get(modalId)?.set(false);
  }

  handleLeaveGame(): void {
    this.showModal('leaveModal');
    this.router.navigateByUrl('/games');
  }

  handleDisconnect(): void {
    this.userAuthService.logout();
    this.hideModal('disconnectModal');
    this.router.navigateByUrl('/');
  }

  protected isUserLoggedIn(): boolean {
    return this.userAuthService.isUserLoggedIn();
  }

  isModalVisible(modalId: string): WritableSignal<boolean> {
    if (!this.modalVisibility.has(modalId)) {
      this.modalVisibility.set(modalId, signal(false));
    }
    return this.modalVisibility.get(modalId)!;
  }

  handleAcceptFriendship(friendId: string, notificationId: string): void {
    this.friendshipService.acceptFriendship(friendId).subscribe({
      next: () => {
        this.notificationService.deleteNotificationFromList(notificationId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la notification :', err);
      }
    });
  }

  handleRejectFriendship(friendId: string, notificationId: string): void {
    this.friendshipService.rejectFriendship(friendId).subscribe({
      next: () => {
        this.notificationService.deleteNotificationFromList(notificationId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la notification :', err);
      }
    });
  }

  handleDeleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId).subscribe()
  }
}
