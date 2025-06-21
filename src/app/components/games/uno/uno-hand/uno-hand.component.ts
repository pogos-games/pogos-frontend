import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoColorPickerModalComponent} from "../uno-color-picker-modal/uno-color-picker-modal.component";
import {UnoCard, UnoCardColor} from "../../../../model/dto/uno/entities/uno-card.interface";

@Component({
  selector: 'app-uno-hand',
  standalone: true,
  imports: [UnoCardComponent, UnoColorPickerModalComponent],
  templateUrl: './uno-hand.component.html',
  styleUrl: './uno-hand.component.scss'
})
export class UnoHandComponent {

  @Input()
  playerCards = signal<UnoCard[]>([])
  @Output()
  playCardEvent: EventEmitter<UnoCard> = new EventEmitter<UnoCard>();
  protected isSelectColorModalVisible: boolean = false;
  protected selectedCard: UnoCard | null = null;

  playCard(card: UnoCard): void {
    if(card.color === UnoCardColor.WILD) {
      this.isSelectColorModalVisible = true;
      this.selectedCard = card;
      return;
    }
    this.playCardEvent.emit(card)
  }

  handleColorSelected(color: UnoCardColor): void {
    if (this.selectedCard) {
      this.selectedCard.declaredColor = color;
      this.playCardEvent.emit(this.selectedCard)
      this.isSelectColorModalVisible = false;
      this.selectedCard = null;
    }
  }
}
