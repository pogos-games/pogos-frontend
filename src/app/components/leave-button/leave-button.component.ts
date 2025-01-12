import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-button',
  imports: [],
  templateUrl: './leave-button.component.html',
  styleUrl: './leave-button.component.scss'
})
export class LeaveButtonComponent {
  @Input({required: true}) text: string = 'Quitter';
}