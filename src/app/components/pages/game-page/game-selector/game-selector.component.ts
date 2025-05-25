import {Component, EventEmitter, Output} from '@angular/core';
import {PogosButton} from "../../../common/pogos-button/pogos-button.component";

@Component({
  selector: 'app-game-selector',
  imports: [
    PogosButton
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent {

  @Output() gameSelected = new EventEmitter<string>();

  onGameClick(title: string) {
    this.gameSelected.emit(title);
  }

}
