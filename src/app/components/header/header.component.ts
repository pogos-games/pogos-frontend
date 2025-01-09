import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { UserService } from "../../services/user.service";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { StorageService } from '../../services/storage/session-storage.service';
import { User } from '../../model/user.interface';
import { ModalComponent } from '../modal/modal.component';
import { CookiesStorageService } from '../../services/storage/cookies-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzDividerModule,
    ModalComponent
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
  public leaveSignal: WritableSignal<boolean> = signal(false);

  constructor(private readonly userService: UserService, private readonly storageService: StorageService, private readonly cookiesStorageService: CookiesStorageService, private readonly router: Router) { }

  user: User = this.storageService.getUserStorage();
  isModalVisible: boolean = false;

  showModal(): void {
    this.isModalVisible = true;
  }

  handleOk(): void {
    this.storageService.removeUserStorage();
    this.cookiesStorageService.deleteCookie('pogos-refreshToken');
    this.isModalVisible = false;
    this.router.navigate(['/']);
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  emitLeave() {
    this.leaveSignal.set(true);
  }

  isUserLoggedIn() {
    return false;
  }
}
