import {Component} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from "ng-zorro-antd/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SignupRequestDto} from "../../model/dto/request/signup-request.dto";
import {catchError, of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup-page',
  standalone: true,
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
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {

  constructor(private readonly authService: AuthService) {
  }

  isPasswordHided: boolean = true;

  loginForm: FormGroup = new FormGroup({
    pseudo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  onSubmit() : void {
    console.log(this.loginForm.value);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const signUpRequest : SignupRequestDto= {
      username:this.loginForm.value.pseudo,
      email: this.loginForm.value.login,
      password: this.loginForm.value.password
    }

    console.log("signup request : ",signUpRequest);

    this.authService.signup(signUpRequest).pipe(
      catchError((err : HttpErrorResponse) =>{
        console.log(err.message);
        this.loginForm.setErrors({error: err.message});
        return of(undefined)
      })
    ).subscribe((response => {
      console.log(response);
      })
    )
  }

}
