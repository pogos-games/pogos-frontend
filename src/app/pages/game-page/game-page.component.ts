import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {GameSelectorComponent} from "../../components/pages/game-page/game-selector/game-selector.component";
import {GameButtonsComponent} from "../../components/pages/game-page/game-buttons/game-buttons.component";
import {RankingComponent} from "../../components/pages/game-page/ranking/ranking.component";
import {BoxJoinCodeComponent} from "../../components/pages/game-page/box-join-code/box-join-code.component";

@Component({
  selector: 'app-game-page',
    imports: [
        HeaderComponent,
        NzRowDirective,
        NzColDirective,
        GameSelectorComponent,
        GameButtonsComponent,
        RankingComponent,
        BoxJoinCodeComponent
    ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

  protected title = 'Blackjack'

}
