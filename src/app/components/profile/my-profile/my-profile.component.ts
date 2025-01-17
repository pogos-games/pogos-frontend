import { Component } from '@angular/core';
import { User } from '../../../model/user.interface';
import { UserAuthService } from '../../../services/auth/user-auth.service'

@Component({
  selector: 'app-my-profile',
  imports: [],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {

  constructor(private sessionStorageService: UserAuthService) { }

  user: User = this.sessionStorageService.user;

}
