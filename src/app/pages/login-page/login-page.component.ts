import { Component, } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective } from "ng-zorro-antd/input";
import { NzIconDirective, NzIconModule } from "ng-zorro-antd/icon";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { AuthService } from "../../auth/service/auth.service";
import { LoginRequestDto } from "../../model/dto/request/login-request.dto";
import { StorageService } from "../../services/storage/session-storage.service";
import { CookiesStorageService } from "../../services/storage/cookies-storage.service";
import { catchError, of } from "rxjs";
import { AuthResponseDto } from '../../model/auth-response.dto';
import { User } from '../../model/user.interface';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [
    ReactiveFormsModule,
    NzInputDirective,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputGroupComponent,
    NzIconDirective,
    NzIconModule,
    NzButtonComponent,
    RouterLink
  ],
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly storageService: StorageService, private readonly cookiesService: CookiesStorageService, private readonly jwtService: JwtService) {
  }

  isPasswordHided: boolean = true;

  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest: LoginRequestDto = {
      email: this.loginForm.value.login,
      password: this.loginForm.value.password
    }

    this.authService.login(loginRequest).pipe(
      catchError((error) => {
        this.loginForm.setErrors({ invalid_credentials: true });
        return of(undefined);
      }
      )).subscribe((response: AuthResponseDto | undefined) => {
        if (!response) {
          return;
        }
        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken;

        const pseudo = this.jwtService.getUsernameFromToken(accessToken) ?? '';

        const user: User = {
          pseudo: pseudo,
          mail: loginRequest.email,
          accessToken: accessToken
        };
        this.storageService.setUserStorage(user);

        const decodedToken = this.jwtService.decodeToken(refreshToken);
        const exp = this.jwtService.getTokenExpirationDate(decodedToken.exp);
        this.cookiesService.setCookie('pogos-refreshToken', refreshToken, exp);

        this.router.navigate(['/games']);
      });
  }
}
