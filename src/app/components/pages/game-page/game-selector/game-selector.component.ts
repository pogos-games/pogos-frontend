import {Component, EventEmitter, Output} from '@angular/core';
import {PogosButton} from "../../../common/pogos-button/pogos-button.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-game-selector',
  imports: [
    PogosButton,
    NgForOf
  ],
  templateUrl: './game-selector.component.html',
  standalone: true,
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent {
  @Output() gameName= new EventEmitter<string>();
  games : string[] = ['BlackJack', 'Uno', 'Tarot', 'Poker'];

  emitGameName(game: string){
    this.gameName.emit(game);
  }
}
