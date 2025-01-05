import {Component, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BlackjackService} from "../../services/blackjack.service";
import {BlackjackDeck} from "../../model/dto/request/black-jack-deck";
import {Card} from "../../model/dto/request/card";
import {BlackJackActions} from "../../model/enum/black-jack.actions.enum";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {delay} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {BlackJackMessage} from "../../model/enum/black-jack.message.enum";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {ChatComponent} from "../../components/chat/chat.component";
import {HeaderComponent} from "../../components/header/header.component";
import {RankingComponent} from "../../components/ranking/ranking.component";
import {GameTableComponent} from "../../components/game-table/game-table.component";
import {NzModalComponent, NzModalService} from "ng-zorro-antd/modal";
import { NzModalModule } from 'ng-zorro-antd/modal';
import {Router} from "@angular/router";

@Component({
  selector: 'app-blackjack-page',
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
    NzModalModule
  ],
  templateUrl: './blackjack-page.component.html',
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent {

  protected blackJackDeck : BlackjackDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: BlackJackMessage.CONTINUE };

  protected BlackJackAction : typeof BlackJackActions = BlackJackActions;

  protected isActionDisabled : boolean = false;

  protected isChatVisible: WritableSignal<boolean> = signal(false);

  public isLeaveModalVisible: WritableSignal<boolean> = signal(false);

  constructor(private blackJackService:BlackjackService,private message:NzMessageService,
                       private readonly router: Router) {
    this.blackJackService.blackjackSubject.pipe(delay(1000)).subscribe((deck: BlackjackDeck|undefined) => {
       if(deck) {
         this.blackJackDeck.playerHand = new Set(deck.playerHand);
          this.blackJackDeck.dealerHand = new Set(deck.dealerHand);
          this.blackJackDeck.playerTotal = deck.playerTotal;
          this.blackJackDeck.message = deck.message;
         switch (deck.message) {
            case BlackJackMessage.PLAYER_BUST:
              this.message.create('error', 'You busted!');
              break;
            case BlackJackMessage.DEALER_BUST:
              this.message.create('success', 'Dealer busted!');
              break;
            case BlackJackMessage.PLAYER_WIN:
              this.message.create('success', 'You win!');
              break;
            case BlackJackMessage.DEALER_WIN:
              this.message.create('error', 'Dealer wins!');
              break;
            case BlackJackMessage.TIE:
              this.message.create('info', 'It\'s a tie!');
              break;
            default:
              // do nothing when game continues
              this.isActionDisabled = false;
              break;
         }
    }});
  }

  executeAction(action : BlackJackActions) : void {
    this.isActionDisabled = true;
    this.blackJackService.sendMessage(action);
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
