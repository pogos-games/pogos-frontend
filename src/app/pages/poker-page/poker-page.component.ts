import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzMessageService} from 'ng-zorro-antd/message';
import {ChatComponent} from "../../components/chat/chat.component";
import {HeaderComponent} from "../../components/header/header.component";
import {RankingComponent} from "../../components/ranking/ranking.component";
import {GameTableComponent} from "../../components/game-table/game-table.component";
import {NzModalComponent, NzModalModule} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
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
