import {Component, Signal} from '@angular/core';
import {Avatar} from '../../../../model/enum/avatar.enum';
import {User} from '../../../../model/user.interface';
import {UserAuthService} from '../../../../services/auth/user-auth.service';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzFormControlComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {CustomValidator} from "../../../../validator/custom.validator";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-my-profile',
  imports: [
    NzDividerModule,
    NzButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NzIconDirective,
    NzFormControlComponent,
    NzInputDirective,
    NzInputGroupComponent
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent {

  user : Signal<User> = this.userAuthService.user;

  isEditing = false;
  hasChanges = false;

  selectedAvatar: Avatar = this.user().avatar || Avatar.DEFAULT;

  readonly avatars: Avatar[] = Object.values(Avatar)

  updateProfileForm = new FormGroup({
    pseudo: new FormControl(this.user().pseudo,  {
      validators: [Validators.minLength(3)],
      asyncValidators: CustomValidator.isUserameExist(this.userService),
      updateOn: 'change',
    }),
    avatar: new FormControl(this.selectedAvatar),
  });

  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService
  ) {
  }

  get formattedAvatarName(): string {
    return this.selectedAvatar ? this.selectedAvatar.replace(/_/g, ' ') : '';
  }

  selectAvatar(avatar: Avatar): void {
    this.selectedAvatar = avatar;
    this.updateProfileForm.get('avatar')?.setValue(avatar);
    this.hasChanges = this.selectedAvatar !== this.user().avatar
  }

  handleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateProfile(): void {
    const formValues = this.updateProfileForm.value;
    const username = formValues.pseudo?.trim() || this.user().pseudo;
    const avatar = formValues.avatar ?? this.selectedAvatar;

    this.userAuthService.updateProfile(username, avatar).subscribe();
    this.isEditing = false;
    this.hasChanges = false;
  }

}
