import {Component, Signal} from '@angular/core';
import {Avatar} from '../../../../model/dto/game/enum/avatar.enum';
import {Component, inject, signal, Signal, WritableSignal} from '@angular/core';
import {User} from '../../../../model/user.interface';
import {UserAuthService} from '../../../../services/auth/user-auth.service';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidator} from "../../../../validator/custom.validator";
import {UserService} from "../../../../services/user.service";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzFormControlComponent} from "ng-zorro-antd/form";
import {AuthService} from "../../../../auth/service/auth.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {catchError, firstValueFrom, of, tap} from "rxjs";
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {ModalComponent} from "../../../common/modal/modal.component";

@Component({
  selector: 'app-my-profile',
  imports: [
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    NzColDirective,
    NzRowDirective,
    NzInputGroupComponent,
    NzButtonComponent,
    NzIconDirective,
    NzInputDirective,
    NzFormControlComponent,
    ModalComponent
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  standalone: true
})
export class MyProfileComponent {

  private readonly userService: UserService = inject(UserService);
  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  private readonly authService = inject(AuthService);
  private readonly notificationService:  NzNotificationService = inject(NzNotificationService);
  private readonly router:Router = inject(Router);

  user : Signal<User> = this.userAuthService.user;

  isEditing = false;
  hasChanges = false;

  selectedAvatar: Avatar = this.user().avatar || Avatar.DEFAULT;

  readonly avatars: Avatar[] = Object.values(Avatar) as Avatar[]

  protected isDeleteAccountModalVisible : WritableSignal<boolean> = signal(false)

  updateProfileForm = new FormGroup({
    pseudo: new FormControl(this.user().pseudo,  {
      validators: [Validators.minLength(3)],
      asyncValidators: CustomValidator.isUserameExist(this.userService),
      updateOn: 'change',
    }),
    avatar: new FormControl(this.selectedAvatar),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });


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
    const username = formValues.pseudo?.trim() ?? this.user().pseudo;
    const avatar = formValues.avatar ?? this.selectedAvatar;

    this.userAuthService.updateProfile(username, avatar).subscribe();
    this.isEditing = false;
    this.hasChanges = false;
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const passwordUpdateRequest: PasswordUpdateRequest = {
        oldPassword: this.passwordForm.get('currentPassword')?.value ?? '',
        newPassword: this.passwordForm.get('newPassword')?.value ?? ''
      }
      this.authService.updatePassword(passwordUpdateRequest).pipe(
        tap(() => {
          this.passwordForm.reset();
          this.createNotification('success', 'Mot de passe mis à jour', 'Votre mot de passe a été mis à jour avec succès.');
        }),
        catchError(error => {
          console.error('Error updating password:', error);

          if (error.status === HttpStatusCode.Unauthorized) {
            this.createNotification(
              'error',
              'Mot de passe incorrect',
              'Le mot de passe actuel que vous avez saisi est incorrect.'
            );
          } else {
            this.createNotification(
              'error',
              'Erreur de mise à jour du mot de passe',
              'Une erreur est survenue lors de la mise à jour de votre mot de passe. Veuillez réessayer.'
            );
          }

          return of(null);
        })
      ).subscribe();
    }
  }

  createNotification(type: string, title: string, text: string): void {
    this.notificationService.create(type, title, text, {
      nzClass: 'custom-notification',
      nzDuration: 5000
    });
  }

  handleCancelDeletingAccount() {
    this.isDeleteAccountModalVisible.set(false);
  }

  async handleDeleteAccount() {
    try {
      await firstValueFrom(this.authService.deleteAccount());
      this.userAuthService.logout();
      this.isDeleteAccountModalVisible.set(false);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error deleting account:', error);
      this.isDeleteAccountModalVisible.set(false);
      this.createNotification('error', 'Erreur de suppression de compte', 'Une erreur est survenue lors de la suppression de votre compte. Veuillez réessayer.');
    }
  }

}
