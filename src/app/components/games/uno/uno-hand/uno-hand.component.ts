// uno-hand.component.ts
import {Component, Input} from '@angular/core';
import {UnoCard, UnoCardColor} from "../../../../model/dto/uno/uno-card.interface";
import {UnoCardComponent} from "../uno-card/uno-card.component";

@Component({
  selector: 'app-uno-hand',
  imports: [
    UnoCardComponent
  ],
  templateUrl: './uno-hand.component.html',
  styleUrl: './uno-hand.component.scss'
})
export class UnoHandComponent {

  @Input({required: true})
  cards: UnoCard[] = []




  get cardCount(): number {
    return this.cards.length;
  }

  get hasManyCCards(): boolean {
    return this.cardCount > 15;
  }

  private sortCards(): void {
    const colorOrder = {
      [UnoCardColor.RED]: 0,
      [UnoCardColor.YELLOW]: 1,
      [UnoCardColor.GREEN]: 2,
      [UnoCardColor.BLUE]: 3,
      [UnoCardColor.WILD]: 4
    };

    this.cards.sort((a, b) => {
      // First sort by color
      const colorDiff = colorOrder[a.color] - colorOrder[b.color];
      if (colorDiff !== 0) return colorDiff;

      // Then sort by value if both are numbers
      if (a.value !== undefined && b.value !== undefined) {
        return a.value - b.value;
      }

      return 0;
    });
  }
}
