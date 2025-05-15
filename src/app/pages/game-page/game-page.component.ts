import { Component, signal, WritableSignal } from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {GameSelectorComponent} from "../../components/pages/game-page/game-selector/game-selector.component";
import {GameButtonsComponent} from "../../components/pages/game-page/game-buttons/game-buttons.component";
import {RankingComponent} from "../../components/pages/game-page/ranking/ranking.component";
import {BoxJoinCodeComponent} from "../../components/pages/game-page/box-join-code/box-join-code.component";
import {ModalComponent} from "../../components/common/modal/modal.component";
import { ActivatedRoute, Router } from "@angular/router";
import {GameActions} from "../../model/enum/game.actions.enum";
import {BlackjackService} from "../../services/games/blackjack.service";

@Component({
  selector: 'app-game-page',
    imports: [
        HeaderComponent,
        NzRowDirective,
        NzColDirective,
        GameSelectorComponent,
        GameButtonsComponent,
        RankingComponent,
        ModalComponent,
        BoxJoinCodeComponent
    ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

  public isWaitingRoomModalVisible: WritableSignal<boolean> = signal(false);
  protected title = 'Blackjack'

  constructor(private readonly router: Router) {}

  handleOkMiddle(): void {
    this.isWaitingRoomModalVisible.set(false);
    this.router.navigate(
      ['/games', this.title.toLowerCase()],
      { queryParams: { gameType: 'solo' } }
    );
  }

  public showModal() {
    this.isWaitingRoomModalVisible.set(true);
  }

  public getModalDescription(): string {
    let description = '';
    description += 'ID de la partie : #11111';
    description += '\nListe des joueurs :  ';
    return description;
  }
}
