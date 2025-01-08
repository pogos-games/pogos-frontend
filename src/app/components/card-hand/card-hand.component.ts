import {Component, Input} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {Card} from "../../model/dto/request/card";
import {NzBadgeComponent} from "ng-zorro-antd/badge";

@Component({
    selector: 'app-card-hand',
    imports: [
        NgOptimizedImage,
        NzBadgeComponent,
        NgClass
    ],
    templateUrl: './card-hand.component.html',
    styleUrl: './card-hand.component.scss'
})
export class CardHandComponent {


  @Input({required:true})
  cards: Card[] = [];

  @Input({required:true})
  handName: string = '';

  @Input({required:true})
  currentUser: boolean = false;

  @Input() isColDirection: boolean = false;

  findCardImage(card : Card) : string {
    return `assets/cards/${card.rank}${card.suit}.png`;
  }

  getCardsSum() : number {
    return this.cards.reduce((sum, card) => sum + card.value, 0);
  }

}
