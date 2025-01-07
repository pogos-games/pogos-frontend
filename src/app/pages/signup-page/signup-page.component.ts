import { Component } from '@angular/core';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective } from "ng-zorro-antd/input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../auth/service/auth.service";
import { SignupRequestDto } from "../../model/dto/request/signup-request.dto";
import { catchError, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../model/user.interface";
import { StorageService } from "../../services/storage/session-storage.service";
import { CookiesService } from "../../services/storage/cookies.service";
import { AuthResponseDto } from '../../model/dto/response/auth-response.dto';

@Component({
    selector: 'app-signup-page',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzInputDirective,
        NzInputGroupComponent,
        NzInputGroupWhitSuffixOrPrefixDirective,
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {

  isPasswordHided: boolean = true;
  isConfirmPasswordHided: boolean = true;

  signupForm: FormGroup = new FormGroup({
    pseudo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mail: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      )
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private readonly authService: AuthService, private readonly storageService: StorageService, private readonly cookiesService: CookiesService) { }

  passwordMatch(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  // Soumission du formulaire
  onSubmit(): void {

    if (this.signupForm.get('pseudo')?.errors) {
      this.signupForm.markAllAsTouched();
      this.signupForm.setErrors({ invalid_credentials: true });
      return;
    }

    if (this.signupForm.get('mail')?.errors) {
      this.signupForm.setErrors({ invalid_mail: true });
      return;
    }

    if (!this.passwordMatch(this.signupForm.get('password')?.value, this.signupForm.get('confirmPassword')?.value)) {
      this.signupForm.setErrors({ notMatching: true });
      return;
    }

    const signUpRequest: SignupRequestDto = {
      username: this.signupForm.value.pseudo,
      email: this.signupForm.value.mail,
      password: this.signupForm.value.password
    };

    this.authService.signup(signUpRequest).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 409) {
            this.signupForm.setErrors({ already_exists: true });
          }
        }
        return of(undefined);
      })
    ).subscribe((response: AuthResponseDto | undefined) => {
      if (!response) {
        return;
      }
      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;
      const user: User = {
        pseudo: signUpRequest.username,
        mail: signUpRequest.email,
        accessToken: accessToken
      };
      this.storageService.setUserStorage(user);
      this.cookiesService.setCookie('refreshToken', refreshToken, 30);
    });

  }
}
