import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { CardHandComponent } from "../../card-hand/card-hand.component";
import { GameTableComponent } from '../game-table.component';

@Component({
  selector: 'app-game-table',
  imports: [
    NgOptimizedImage,
    CardHandComponent
  ],
  templateUrl: './game-table-blackjack.component.html',
  standalone: true,
  styleUrl: './game-table-blackjack.component.scss'
})
export class GameTableBlackjackComponent extends GameTableComponent {
}
