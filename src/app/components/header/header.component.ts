import {Component, Input, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {SessionStorageService} from '../../services/storage/session-storage.service';
import {User} from '../../model/user.interface';
import {ModalComponent} from '../modal/modal.component';
import {CookiesStorageService} from '../../services/storage/cookies-storage.service';
import {UserAuthService} from "../../services/auth/user-auth.service";

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

  constructor(private readonly userAuthService:UserAuthService, private readonly router: Router) { }

  username: string|undefined = this.userAuthService.getUsername();
  isModalVisible: boolean = false;

  showModal(): void {
    this.isModalVisible = true;
  }

  handleDisconnect(): void {
    this.userAuthService.logout();
    this.username = undefined;
    this.isModalVisible = false;
    this.router.navigateByUrl('/');
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
