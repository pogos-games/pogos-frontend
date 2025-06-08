import {Component, effect, inject} from '@angular/core';
import {UnoCard, UnoCardColor} from "../../../../model/dto/uno/uno-card.interface";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoService} from "../../../../services/uno.service";
import {UnoAction, UnoActionType} from "../../../../model/dto/uno/uno-actions.interface";
import {UnoColorPickerModalComponent} from "../uno-color-picker-modal/uno-color-picker-modal.component";

@Component({
  selector: 'app-uno-hand',
  standalone: true,
  imports: [UnoCardComponent, UnoColorPickerModalComponent],
  templateUrl: './uno-hand.component.html',
  styleUrl: './uno-hand.component.scss'
})
export class UnoHandComponent {
  private readonly unoService: UnoService = inject(UnoService);
  protected isSelectColorModalVisible: boolean = false;
  protected cards: UnoCard[] = [];
  protected selectedCard: UnoCard | null = null;

  constructor() {
    effect(() => {
      this.cards = this.unoService.playerCards();
      this.sortCardsByColor();
    });
  }

  private sortCardsByColor(): void {
    const colorOrder: Record<UnoCardColor, number> = {
      [UnoCardColor.RED]: 0,
      [UnoCardColor.YELLOW]: 1,
      [UnoCardColor.GREEN]: 2,
      [UnoCardColor.BLUE]: 3,
      [UnoCardColor.WILD]: 4
    };

    this.cards.sort((a, b) => colorOrder[a.color] - colorOrder[b.color]);
  }

  playCard(card: UnoCard): void {
    if (this.unoService.isPlayerTurn()) {
      const topCard: UnoCard = this.unoService.unoGameState().topCard;
      if (
        card.color === UnoCardColor.WILD ||
        card.color === topCard.color ||
        card.value === topCard.value
      ) {

        if(card.color === UnoCardColor.WILD) {
          this.isSelectColorModalVisible = true;
          this.selectedCard = card;
          return;
        }

        const action: UnoAction = {
          type: UnoActionType.PLAY_CARD,
          roomId: this.unoService.getGameId(),
          playerId: this.unoService.getPlayerId(),
          card: card
        };
        this.sendAction(action);
      }
    }
  }

  handleColorSelected(color: UnoCardColor): void {
    if (this.selectedCard) {
      const action: UnoAction = {
        type: UnoActionType.PLAY_CARD,
        roomId: this.unoService.getGameId(),
        playerId: this.unoService.getPlayerId(),
        card: this.selectedCard,
        declaredColor: color
      };
      this.sendAction(action);
    }
  }

  sendAction(action: UnoAction): void {
    this.unoService.sendMessage('ACTION', action);
    this.isSelectColorModalVisible = false;
    this.selectedCard = null;
  }
}
