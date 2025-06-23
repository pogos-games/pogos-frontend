import {Component, EventEmitter, Input, Output, Signal, signal} from '@angular/core';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'game-action-button',
  templateUrl: './action-button.component.html',
  standalone: true,
  imports: [
    NzIconDirective,
    NzButtonComponent
  ],
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
  @Input({required: true}) text: string = "";
  @Input({required: true}) icon: string = "";
  @Input({required: true}) isActionDisabled: Signal<boolean> = signal(false);
  @Input() showButton: boolean = true;
  @Output() onCLick = new EventEmitter();

  executeAction(){
    this.onCLick.emit();
  }
}
