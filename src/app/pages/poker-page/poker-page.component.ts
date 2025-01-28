import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzMessageService} from 'ng-zorro-antd/message';
import { ChatComponent } from '../../components/games/chat/chat.component';
import { HeaderComponent } from '../../components/common/header/header.component';
import { RankingComponent } from '../../components/pages/game-page/ranking/ranking.component';
import { GameTableComponent } from '../../components/games/game-table/game-table.component'; 
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import { Card } from '../../model/dto/request/card';
import {GameType} from "../../model/enum/game-type.enum";
import {PokerActions} from '../../model/enum/poker.actions.enum';
import { PokerService } from '../../services/poker.service';

@Component({
  selector: 'app-poker-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    NzIconDirective,
    NzBadgeComponent,
    NzDividerComponent,
    ChatComponent,
    HeaderComponent,
    RankingComponent,
    GameTableComponent,
    NzModalComponent,
    NzModalModule,
  ],
  templateUrl: './poker-page.component.html',
  styleUrl: './poker-page.component.scss'
})
export class PokerPageComponent implements OnInit{

  protected PokerActions : typeof PokerActions = PokerActions;

  public isLeaveModalVisible: WritableSignal<boolean> = signal(false);

  protected gameType: GameType|undefined;

  protected isActionDisabled : boolean = false;

  protected isChatVisible: WritableSignal<boolean> = signal(false);

  protected currentPotAmount: Number = 0;

  protected readonly GameType = GameType;

  protected hands: {
    player1Hand: Card[], 
    player2Hand: Card[], 
    player3Hand: Card[], 
    dealerHand: Card[], 
    selfHand: Card[] 
  } = {
    player1Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    player2Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    player3Hand: [
      { rank: 'back', suit: '', value: 0 },
      { rank: 'back', suit: '', value: 0 },
    ],
    selfHand: [
      { rank: 'A', suit: 'H', value: 0 },
      { rank: 'K', suit: 'H', value: 0 },
    ],
    dealerHand: [
      { rank: 'A', suit: 'S', value: 0 },
      { rank: 'A', suit: 'C', value: 0 },
      { rank: 'A', suit: 'D', value: 0 },
    ],
  };

  constructor(private pokerService:PokerService, private message:NzMessageService, private readonly router:Router, private readonly route:ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gameType = params['gameType'];
    });
  }

  executeAction(action : PokerActions) : void {
    this.isActionDisabled = true;
    this.pokerService.sendMessage(action);
  }

  endTurn() : void {
    this.hands.dealerHand.push({ rank: '2', suit: 'D', value: 0 });
  }

  open(): void {
    this.isChatVisible.set(true);
  }

  handleCancelMiddle(){
    this.isLeaveModalVisible.set(false)
  }

  handleOkMiddle(){
    this.isLeaveModalVisible.set(false)
    return this.router.navigateByUrl("/games")
  }
}
