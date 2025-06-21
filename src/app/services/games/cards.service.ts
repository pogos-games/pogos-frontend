import { Injectable } from '@angular/core';
import {Card} from "../../model/dto/game/card.interface";

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  protected deck: Card[] = [];

  constructor() {
    this.createDeck();
  }

  createDeck() {
    this.deck = [];
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (const suit of suits) {
      for (const rank of ranks) {
        this.deck.push({ rank, suit, value: this.getCardValue(rank) });
      }
    }
  }

  getCardValue(rank: string): number {
    if (rank === 'A') {
      return 11;
    } else if (['J', 'Q', 'K'].includes(rank)) {
      return 10;
    } else {
      return parseInt(rank);
    }
  }

  drawCard() {
    return this.deck.pop();
  }
}
