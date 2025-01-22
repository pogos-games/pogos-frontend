import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { UserAuthService } from "../../services/auth/user-auth.service";
import { User } from "../../model/user.interface";
import { PogosButton } from "../../components/pogos-button/pogos-button.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    HeaderComponent,
    PogosButton,
    RouterOutlet,
    RouterLink,
    NzDividerModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  protected user: User;

  constructor(private readonly userAuthService: UserAuthService) {
    this.user = this.userAuthService.user;
  }



}
