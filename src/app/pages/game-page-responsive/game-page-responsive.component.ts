import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {GameSelectorComponent} from "../../components/game-page/game-selector/game-selector.component";
import {GameButtonsComponent} from "../../components/game-page/game-buttons/game-buttons.component";
import {RankingComponent} from "../../components/game-page/ranking/ranking.component";

@Component({
  selector: 'app-game-page-responsive',
  imports: [
    HeaderComponent,
    NzRowDirective,
    NzColDirective,
    GameSelectorComponent,
    GameButtonsComponent,
    RankingComponent
  ],
  templateUrl: './game-page-responsive.component.html',
  styleUrl: './game-page-responsive.component.scss'
})
export class GamePageResponsiveComponent {

  protected title = 'Blackjack'

}
