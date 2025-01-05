import {Component,} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from "ng-zorro-antd/input";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService} from "../../services/auth.service";
import {LoginRequestDto} from "../../model/dto/request/login-request.dto";
import {catchError} from "rxjs";

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
    NzButtonComponent,
    RouterLink
  ],
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  constructor(private readonly authService:AuthService) {
  }

  isPasswordHided: boolean = true;

  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  onSubmit() : void {
    console.log(this.loginForm.value);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest : LoginRequestDto = {
      email: this.loginForm.value.login,
      password: this.loginForm.value.password
    }

    this.authService.login(loginRequest).pipe(
      catchError((error) => {
        this.loginForm.setErrors({ invalid_credentials: true });
        return error;
      }
    )).subscribe((response => {
      console.log(response);
      }))
  }

}
