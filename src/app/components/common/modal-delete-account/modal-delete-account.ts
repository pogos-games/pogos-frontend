import {Component, EventEmitter, inject, Input, Output, signal, WritableSignal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-modal-delete-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule
  ],
  templateUrl: './modal-delete-account.html',
  styleUrl: './modal-delete-account.scss'
})
export class ModalComponent {
  @Output() onCancel = new EventEmitter();
  @Output() onOk: EventEmitter<void> = new EventEmitter<void>();
  @Input({ required: true }) isVisible: WritableSignal<boolean> = signal(false);

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required, this.matchOtherValidator('password')]],
  })

matchOtherValidator(otherControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null; // Ignore tant que le parent n'est pas défini
    const otherControl = control.parent.get(otherControlName);
    if (!otherControl) return null;
    return control.value === otherControl.value ? null : { mismatch: true };
  };
}

  handleOk(): void {
    if(this.form.valid){
      this.onOk.emit();
    }
  }

  handleCancel(): void {
    this.isVisible.set(false);
  }
}
