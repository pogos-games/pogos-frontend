import { Component } from '@angular/core';
import { Avatar } from '../../../model/enum/avatar.enum';
import { User } from '../../../model/user.interface';
import { UserAuthService } from '../../../services/auth/user-auth.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CustomValidator } from '../../../validator/custom.validator';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { NzFormControlComponent } from "ng-zorro-antd/form";
import { NzInputDirective, NzInputGroupComponent } from "ng-zorro-antd/input";
import { UpdateUserRequestDto } from '../../../model/dto/request/update-user-request.dto';
import { UpdateUserResponseDto } from '../../../model/dto/response/update-user-response.dto';

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
  user: User = this.userAuthService.user;

  avatars = Object.values(Avatar);

  isEditing = false;
  hasChanges = false;

  selectedAvatar: Avatar = this.user.avatar || 'default';

  updateProfileForm = new FormGroup({
    pseudo: new FormControl(this.user.pseudo, {
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
    this.listenToFormChanges();
  }

  get formattedAvatarName(): string {
    return this.selectedAvatar.replace(/_/g, ' ');
  }

  private listenToFormChanges(): void {
    this.updateProfileForm.valueChanges.subscribe((formValues) => {
      this.hasChanges = this.checkForChanges(formValues);
    });
  }

  private checkForChanges(formValues: any): boolean {
    return (
      formValues.pseudo !== this.user.pseudo || formValues.avatar !== this.user.avatar
    );
  }

  selectAvatar(avatar: Avatar): void {
    this.selectedAvatar = avatar;
    this.updateProfileForm.get('avatar')?.setValue(avatar);
  }

  handleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateProfile(): void {
    if (this.updateProfileForm.invalid) {
      return;
    }
    const formValues = this.updateProfileForm.value;

    const request: UpdateUserRequestDto = {
      username: formValues.pseudo ?? this.user.pseudo,
      avatar: formValues.avatar ?? this.user.avatar
    };


    this.userService.updateProfile(this.user.id, request).subscribe((response: UpdateUserResponseDto | undefined) => {
      if (!response) {
        return;
      }

      this.userAuthService.updateProfile(response.username, response.avatar);
      this.isEditing = false;
    });

  }
}
