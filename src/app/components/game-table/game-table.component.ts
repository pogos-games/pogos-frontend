import {Component} from '@angular/core';
import {BlackJackActions} from "../../model/enum/black-jack.actions.enum";
import {BlackJackMessage} from "../../model/enum/black-jack.message.enum";
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {BlackjackDeck} from "../../model/dto/request/black-jack-deck";
import {Card} from "../../model/dto/request/card";
import {CardHandComponent} from "../card-hand/card-hand.component";

@Component({
  selector: 'app-game-table',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    NzSpinComponent,
    CardHandComponent
  ],
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.scss'
})
export class GameTableComponent {

  protected readonly BlackJackAction = BlackJackActions;
  protected readonly BlackJackMessage = BlackJackMessage;
  protected blackJackDeck : BlackjackDeck = { playerHand: new Set<Card>(), dealerHand: new Set<Card>(), playerTotal: 0, message: BlackJackMessage.CONTINUE };

  cards: Card[] = [
    { rank: 'A', suit: 'H', value: 1 },
    { rank: '2', suit: 'C', value: 2 },
    { rank: '3', suit: 'S', value: 3 },
    { rank: '4', suit: 'D', value: 4 },
  ];

  executeAction(action : BlackJackActions) : void {
    //this.isActionDisabled = true;
    // this.blackJackService.sendMessage(action);
  }

}
