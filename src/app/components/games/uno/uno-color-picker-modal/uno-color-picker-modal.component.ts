import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UnoCardColor} from "../../../../model/dto/uno/uno-card.interface";
import {NzModalComponent, NzModalContentDirective} from "ng-zorro-antd/modal";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-uno-color-picker-modal',
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NgClass
  ],
  templateUrl: './uno-color-picker-modal.component.html',
  styleUrl: './uno-color-picker-modal.component.scss'
})
export class UnoColorPickerModalComponent {

  @Input() isVisible = false;
  @Output() colorSelected = new EventEmitter<UnoCardColor>();
  @Output() cancelled = new EventEmitter<void>();

  // array of colors excluding 'WILD'
  colors: UnoCardColor[] = (Object.values(UnoCardColor) as UnoCardColor[]).filter(
    color => color !== 'WILD'
  );

  selectColor(color: UnoCardColor) {
    this.colorSelected.emit(color);
  }

  cancel() {
    this.cancelled.emit();
  }

  onOverlayClick(event: Event) {

    this.cancel();
  }

}
