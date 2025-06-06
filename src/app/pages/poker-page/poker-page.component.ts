import {Component} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {HeaderComponent} from '../../components/common/header/header.component';
import {RankingComponent} from '../../components/pages/game-page/ranking/ranking.component';
import {GameTablePokerComponent} from '../../components/games/game-table/game-table-poker/game-table-poker.component';
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {PokerActions} from '../../model/enum/poker.actions.enum';
import {PokerService} from '../../services/games/poker.service';
import {PlayGamePage} from "../../components/common/play-game-page/play-game-page.component";
import {ActionRowComponent} from "../../components/common/actions-row/action-row.component";
import {ActionDescriptor} from "../../components/common/play-game-page/action-descriptor";

@Component({
  selector: 'app-poker-page',
  standalone: true,
  imports: [
    HeaderComponent,
    RankingComponent,
    GameTablePokerComponent,
    NzModalComponent,
    NzModalModule,
    ActionRowComponent,
  ],
  templateUrl: './poker-page.component.html',
  styleUrl: './poker-page.component.scss'
})
export class PokerPageComponent extends PlayGamePage {

  protected override gameAction: typeof PokerActions = PokerActions;

  protected currentPotAmount: Number = 0;

  protected playerBalance: number = 1000;

  protected playerBet: number = 0; // Mise actuelle du joueur

  isPotEmpty = false;

  override actions = [
    new ActionDescriptor("Miser", "check", PokerActions.BET, this.isPotEmpty),
    new ActionDescriptor("Suivre", "check", PokerActions.CALL, !this.isPotEmpty),
    new ActionDescriptor("Relancer", "check", PokerActions.RAISE, !this.isPotEmpty)
  ]

  override secondaryActions = [
    new ActionDescriptor("Check", "check", PokerActions.CHECK),
    new ActionDescriptor("All In", "check", PokerActions.ALL_IN),
    new ActionDescriptor("Se coucher", "check", PokerActions.FOLD)
  ]

  constructor(pokerService: PokerService, message: NzMessageService, router: Router, route: ActivatedRoute) {
    super(pokerService, message, router, route);
  }

  endTurn(): void {
    this.hands.dealerHand.push({ rank: '2', suit: 'D', value: 0 });
  }

  protected readonly PokerActions = PokerActions;

  placeBet(bet: number) {
    this.playerBet = bet
  }

  protected gameFound() {
    console.log("game found")
  }
}
