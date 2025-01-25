import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-leave-button',
  imports: [],
  templateUrl: './leave-button.component.html',
  styleUrl: './leave-button.component.scss'
})
export class LeaveButtonComponent {
  @Input({required: true}) text: string = 'Quitter';
}
