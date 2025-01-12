import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {ModalComponent} from '../modal/modal.component';
import {UserAuthService} from "../../services/auth/user-auth.service";
import { LeaveButtonComponent } from '../leave-button/leave-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzDividerModule,
    ModalComponent,
    RouterLink,
    LeaveButtonComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {

  @Input({ required: true })
  title: string = "";

  @Input({ required: true })
  canLeave: boolean = false;

  @Input() public leaveSignal: WritableSignal<boolean> = signal(false);

  username: string | undefined = this.userAuthService.getUsername();

  modalVisibility: Map<string, WritableSignal<boolean>> = new Map();

  constructor(private readonly userAuthService:UserAuthService, private readonly router: Router) { }

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
    this.username = undefined;
    this.hideModal('disconnectModal');
    this.router.navigateByUrl('/');
  }

  emitLeave(): void {
    this.leaveSignal.set(true);
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
}
