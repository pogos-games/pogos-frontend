import { Component, Input } from '@angular/core';
import { NgClass, NgOptimizedImage, CommonModule } from "@angular/common";
import { NzBadgeComponent, NzBadgeModule } from "ng-zorro-antd/badge";
import {Card} from "../../../model/dto/game/card.interface";

@Component({
  selector: 'app-card-hand',
  imports: [
    NgOptimizedImage,
    NzBadgeComponent,
    NgClass,
    CommonModule,
    NzBadgeModule
  ],
  templateUrl: './card-hand.component.html',
  standalone: true,
  styleUrl: './card-hand.component.scss'
})
export class CardHandComponent {

  @Input({ required: true })
  cards: Card[] = [];

  @Input({ required: true })
  handName: string = '';

  @Input({ required: true })
  currentUser: boolean = false;

  @Input() isColDirection: boolean = false;

  // Nouveau: pour indiquer si c'est la main du croupier
  @Input() isDealer: boolean = false;

  // Nouveau: pour indiquer si la partie est terminée
  @Input() gameEnded: boolean = false;

  findCardImage(card: Card, index: number): string {
    // Si c'est le croupier ET que c'est la deuxième carte ET que la partie n'est pas finie
    if (this.isDealer && index === 1 && !this.gameEnded) {
      return 'assets/cards/back.png'; // Carte face cachée
    }
    return `assets/cards/${card.rank}${card.suit}.png`;
  }

  getCardsSum(): number {
    // Si c'est le croupier et que la partie n'est pas finie, on ne compte que la première carte
    if (this.isDealer && !this.gameEnded && this.cards.length > 1) {
      return this.cards[0].value ?? 0;
    }
    return this.cards.reduce((sum, card) => sum + (card.value ?? 0), 0);
  }

  // Méthode pour obtenir les cartes à afficher avec le bon statut
  getDisplayCards(): Card[] {
    return this.cards;
  }

  // Méthode de tracking pour ngFor
  trackByIndex(index: number, item: Card): number {
    return index;
  }
}