import {Component} from '@angular/core';
import {Avatar} from '../../../model/enum/avatar.enum';
import {User} from '../../../model/user.interface';
import {UserAuthService} from '../../../services/auth/user-auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent {

  user: User| undefined = this.userAuthService.user();

  avatars : Avatar[]  = Object.values(Avatar);

  selectedAvatar: string = this.user?.avatar || 'default';

  constructor(private readonly userAuthService: UserAuthService) { }

  get formattedAvatarName(): string {
    return this.selectedAvatar.replace(/_/g, ' ');
  }

  selectAvatar(avatar: string): void {
    console.log('update avatar')
    this.userAuthService.updateAvatar(avatar);
  }
}
