import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pogos-button',
  templateUrl: './pogos-button.component.html',
  styleUrls: ['./pogos-button.component.scss'],
  standalone: true
})
export class PogosButton {
  @Input({ required: true }) title: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
