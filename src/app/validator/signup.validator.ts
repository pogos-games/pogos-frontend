import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, first } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export class SignupValidator {

  static createValidator(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ username_already_exists: boolean } | null> => {
      return control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          console.log("Validation déclenchée pour :", value);

          if (!value || value.trim() === '') {
            return of(null);
          }

          return userService.usernameExists(value).pipe(
            map((result: boolean) =>
              result ? { username_already_exists: true } : null
            ),
            catchError((error) => {
              return of(null);
            })
          );
        }),
        first()
      );
    };
  }

  static passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }
      const passwordControl = formGroup.get(passwordControlName);
      if (!passwordControl) {
        return null;
      }
      return passwordControl.value === control.value ? null : {password_miss_match: true};
    };
  }

}
