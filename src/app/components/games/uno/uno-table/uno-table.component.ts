import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {UnoHandComponent} from "../uno-hand/uno-hand.component";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {UnoBackHandComponent} from "../uno-back-hand/uno-back-hand.component";
import {ActivatedRoute} from "@angular/router";
import {UserAuthService} from "../../../../services/auth/user-auth.service";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Clipboard} from '@angular/cdk/clipboard';
import {NgOptimizedImage, NgStyle} from "@angular/common";
import {DirectionWheelComponent} from "../direction-wheel/direction-wheel.component";
import {UnoGameDirection} from "../../../../model/dto/uno/enum/uno-game-direction.enum";
import {UnoCard, UnoCardColor, UnoCardType} from "../../../../model/dto/uno/entities/uno-card.interface";
import {UnoPlayer} from "../../../../model/dto/uno/entities/uno-player.interface";

@Component({
  selector: 'app-uno-table',
  imports: [
    UnoHandComponent,
    UnoCardComponent,
    UnoCardBackComponent,
    UnoBackHandComponent,
    NzBadgeComponent,
    NzIconDirective,
    NgStyle,
    NgOptimizedImage,
    DirectionWheelComponent
  ],
  templateUrl: './uno-table.component.html',
  standalone: true,
  styleUrl: './uno-table.component.scss'
})
export class UnoTableComponent {


  @Input()
  currentPlayerId = signal<string>("")
  @Input()
  orderedPlayers = signal<UnoPlayer[]>([]);
  @Input()
  topCard = signal<UnoCard>({color: UnoCardColor.RED, type: UnoCardType.NUMBER})
  @Input()
  direction= signal<UnoGameDirection>(UnoGameDirection.CLOCKWISE);
  @Input()
  playerCards = signal<UnoCard[]>([])
  @Input()
  playerId = signal<string>("")
  @Input()
  gameId = ""

  @Output()
  drawCardEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  playCardEvent: EventEmitter<UnoCard> = new EventEmitter<UnoCard>();

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  protected username : string = this.userAuthService.user().pseudo;
  // current player id

  protected readonly gameMode = this.route.snapshot.queryParams['gameMode'];

  protected readonly clipBoard: Clipboard = inject(Clipboard);

  constructor() {}

  drawCard() {
    if(this.isPlayerTurn(this.playerId())) {
      this.drawCardEvent.emit()
    }
  }

  isPlayerTurn(playerId: string) : boolean {
    return this.currentPlayerId()  === playerId;
  }

  protected copyGameId(): void {
    const gameId = this.gameId;
    if (gameId != "") {
      this.clipBoard.copy(gameId);
    }
  }

}
