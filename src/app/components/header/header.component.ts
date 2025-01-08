import { Component, Input, signal, WritableSignal } from '@angular/core';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { RouterLink } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective
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

  constructor(private readonly userService: UserService) { }

  emitLeave() {
    this.leaveSignal.set(true);
  }

  isUserLoggedIn() {
    return false;
  }

}
