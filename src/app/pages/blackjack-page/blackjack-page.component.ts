import {Component, signal, WritableSignal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {BlackjackService} from "../../services/blackjack.service";
import {BlackjackDeck} from "../../model/dto/request/black-jack-deck";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {Card} from "../../model/dto/request/card";
import {BlackJackActions} from "../../model/enum/black-jack-actions";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {delay} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {BlackJackMessage} from "../../model/enum/black-jack-message";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzDrawerComponent} from "ng-zorro-antd/drawer";
import {ChatComponent} from "../../components/chat/chat.component";

@Component({
  selector: 'app-blackjack-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    NzIconDirective,
    NzSpinComponent,
    NzBadgeComponent,
    NzDividerComponent,
    NzDrawerComponent,
    ChatComponent
  ],
  templateUrl: './blackjack-page.component.html',
  styleUrl: './blackjack-page.component.scss'
})
export class BlackjackPageComponent {

  protected blackJackDeck : BlackjackDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: BlackJackMessage.CONTINUE };

  protected BlackJackAction : typeof BlackJackActions = BlackJackActions;

  protected isActionDisabled : boolean = false;

  protected readonly BlackJackMessage = BlackJackMessage;

  protected visible: WritableSignal<boolean> = signal(false);

  constructor(private blackJackService:BlackjackService,private message:NzMessageService) {
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

  findCardImage(card : Card) : string {
    return `assets/cards/${card.rank}${card.suit}.png`;
  }

  executeAction(action : BlackJackActions) : void {
    this.isActionDisabled = true;
    this.blackJackService.sendMessage(action);
  }

  open(): void {
    this.visible.set(true);
  }
}
