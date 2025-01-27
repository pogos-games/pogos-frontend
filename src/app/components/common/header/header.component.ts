import {Component, Input, OnInit, Signal, signal, WritableSignal} from '@angular/core';
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
import {NotificationsResponseDto} from "../../../model/dto/response/notifications-response.dto";
import {UserAuthService} from "../../../services/auth/user-auth.service";
import {LocalStorageService} from "../../../services/storage/local-storage.service";
import {FriendshipService} from "../../../services/friendship.service";
import {NotificationService} from "../../../services/notification.service";

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
export class HeaderComponent implements OnInit {

  @Input({ required: true })
  title: string = "";

  @Input({ required: true })
  canLeave: boolean = false;

  @Input()
  leaveLink: string | undefined;

  @Input() public leaveSignal: WritableSignal<boolean> = signal(false);


  modalVisibility: Map<string, WritableSignal<boolean>> = new Map();

  isDarkTheme: boolean = false

  user: Signal<User> = this.userAuthService.user;

  notifications: WritableSignal<NotificationsResponseDto[]> = signal([]);

  constructor(private readonly userAuthService: UserAuthService,
              private readonly router: Router,
              private readonly localStorageService: LocalStorageService,
              private readonly notificationService: NotificationService,
              private readonly friendshipService: FriendshipService) { }

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

  getNotifications(): void {
    this.notificationService.getNotifications(this.user().id).subscribe((response: NotificationsResponseDto[]) => {
      // Mise à jour des notifications via le signal
      this.notifications.set(response);

      // Mise à jour du nombre de notifications
      this.user().nbNotifications = response.length;

      console.log('Notifications mises à jour :', this.notifications());
    });
  }

  ngOnInit(): void {

    // Theme management
    const savedTheme = this.localStorageService.getItem('theme');

    if (savedTheme !== null) {
      this.isDarkTheme = JSON.parse(savedTheme);
    } else {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    document.body.classList.toggle('dark-theme', this.isDarkTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (savedTheme === null) {
        this.isDarkTheme = event.matches;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
      }
    });

    // Notification management
    this.getNotifications();

  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    this.localStorageService.setItem('theme', JSON.stringify(this.isDarkTheme));
  }

  handleAcceptFriendship(friendId: string): void {
    this.friendshipService.acceptFriendship(friendId).subscribe(() => {
      this.getNotifications();
    })
  }

  handleRejectFriendship(friendId: string): void {
    this.friendshipService.rejectFriendship(friendId).subscribe(() => {
      this.getNotifications();
    })
  }
}
