import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {ModalComponent} from '../modal/modal.component';
import {UserAuthService} from "../../services/auth/user-auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzDividerModule,
    ModalComponent,
    RouterLink
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
  public leaveSignal: WritableSignal<boolean> = signal(false);

  username: string|undefined = this.userAuthService.getUsername();

  isModalVisible: WritableSignal<boolean> = signal(false);

  isUserLoggedIn: WritableSignal<boolean> = signal(false)

  constructor(private readonly userAuthService:UserAuthService, private readonly router: Router) { }

  ngOnInit() {
    const isUserLoggedIn = this.userAuthService.isUserLoggedIn();
    if(!isUserLoggedIn) {
        this.userAuthService.updateToken().subscribe(
          (tokenRefreshed:boolean) => tokenRefreshed ? this.isUserLoggedIn.set(true) :  this.isUserLoggedIn.set(false))
    } else this.isUserLoggedIn.set(true);
  }

  showModal(): void {
    this.isModalVisible.set(true);
  }

  handleDisconnect(): void {
    this.userAuthService.logout();
    this.username = undefined;
    this.isModalVisible.set(false);
    this.router.navigateByUrl('/');
  }

  emitLeave() {
    this.leaveSignal.set(true);
  }

}
