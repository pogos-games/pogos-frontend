import { Component, Input } from '@angular/core';
import { NzIconDirective } from "ng-zorro-antd/icon";

@Component({
  selector: 'app-leave-button',
  imports: [
    NzIconDirective
  ],
  templateUrl: './leave-button.component.html',
  styleUrl: './leave-button.component.scss'
})
export class LeaveButtonComponent {
  @Input({ required: true }) text: string = 'Quitter';
}
