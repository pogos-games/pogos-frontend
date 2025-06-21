import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NgClass} from "@angular/common";
import {UnoCardColor} from "../../../../model/dto/uno/entities/uno-card.interface";

@Component({
  selector: 'app-uno-color-picker-modal',
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NgClass
  ],
  templateUrl: './uno-color-picker-modal.component.html',
  standalone: true,
  styleUrl: './uno-color-picker-modal.component.scss'
})
export class UnoColorPickerModalComponent {

  @Input() isVisible = false;
  @Output() colorSelected = new EventEmitter<UnoCardColor>();

  // array of colors excluding 'WILD'
  colors: UnoCardColor[] = (Object.values(UnoCardColor) as UnoCardColor[]).filter(
    color => color !== 'WILD'
  );

  selectColor(color: UnoCardColor) {
    this.colorSelected.emit(color);
  }

}
