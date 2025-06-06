import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {NgIf} from "@angular/common";
import {NzIconDirective} from "ng-zorro-antd/icon";
import { NzButtonComponent } from "ng-zorro-antd/button";

@Component({
  selector: 'game-action-button',
  templateUrl: './action-button.component.html',
  standalone: true,
  imports: [
    NgIf,
    NzIconDirective,
    NzButtonComponent
  ],
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
  @Input({required: true}) text: string = "";
  @Input({required: true}) icon: string = "";
  @Input({required: true}) isActionDisabled: WritableSignal<boolean> = signal(false);
  @Input() condition: boolean = true;
  @Output() onCLick = new EventEmitter();

  executeAction(){
    this.onCLick.emit();
  }
}
