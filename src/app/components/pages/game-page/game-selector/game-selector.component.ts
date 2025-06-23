import {Component, EventEmitter, Output} from '@angular/core';
import {PogosButton} from "../../../common/pogos-button/pogos-button.component";

@Component({
  selector: 'app-game-selector',
  imports: [
    PogosButton
  ],
  templateUrl: './game-selector.component.html',
  standalone: true,
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent {
  @Output() gameName= new EventEmitter<string>();
  games : string[] = ['BlackJack', 'Uno', 'Poker'];

  emitGameName(game: string){
    this.gameName.emit(game);
  }
}
