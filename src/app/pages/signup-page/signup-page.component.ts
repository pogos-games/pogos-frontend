import {Component} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from "ng-zorro-antd/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../auth/service/auth.service";
import {SignupRequestDto} from "../../model/dto/request/signup-request.dto";
import {catchError, of} from "rxjs";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {AuthResponseDto} from '../../model/auth-response.dto';
import {UserAuthService} from "../../services/auth/user-auth.service";
import {UserService} from "../../services/user.service";
import {NzFormControlComponent, NzFormDirective} from "ng-zorro-antd/form";
import {SignupValidator} from "../../validator/signup.validator";

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
    RouterLink,
    NzFormDirective,
    NzFormControlComponent
  ],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {

  isPasswordHided: boolean = true;
  isConfirmPasswordHided: boolean = true;

  signupForm: FormGroup = new FormGroup({

    pseudo: new FormControl('', {validators:[Validators.required, Validators.minLength(3)], asyncValidators :SignupValidator.createValidator(this.userService), updateOn:'change'}),
    mail: new FormControl('',{validators:[Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)],updateOn:'change'}),
    password: new FormControl('',{validators:[Validators.required,Validators.minLength(6), Validators.maxLength(20)],updateOn:'change'}),
    confirmPassword: new FormControl('',{validators:[Validators.required, SignupValidator.passwordMatchValidator('password')],updateOn:'change'})
  })

  constructor(private readonly authService: AuthService,
              private readonly userAuthService:UserAuthService,
              private readonly userService:UserService,
              private readonly router: Router) { }


  onSubmit(): void {

    console.log("into submit")
    if(this.signupForm.invalid){
      this.signupForm.markAllAsTouched()
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
          console.log("error messsage : ",error?.error.message)
          if (error.status === HttpStatusCode.Conflict) {
            this.signupForm.setErrors({ email_already_exists: true });
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
      this.userAuthService.login(accessToken,refreshToken);
      return this.router.navigate(['/games']);
    });

  }
}
