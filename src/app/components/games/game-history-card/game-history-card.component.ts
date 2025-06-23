import {Component, Input} from '@angular/core';
import {GameHistoryResponse} from "../../../model/dto/response/game-history-response.interface";
import {GameMode} from "../../../model/dto/game/enum/game-mode.enum";
import {Avatar} from "../../../model/dto/game/enum/avatar.enum";
import {GameType} from "../../../model/dto/game/enum/game-type.enum";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-game-history-card',
  imports: [
    NzTagComponent,
    DatePipe
  ],
  templateUrl: './game-history-card.component.html',
  styleUrl: './game-history-card.component.scss'
})
export class GameHistoryCardComponent {

  @Input({required:true}) gameHistory : GameHistoryResponse = {id:'',mode:GameMode.SOLO, type: GameType.POKER, date: new Date(),player1: {id:'', avatar: Avatar.DEFAULT, username: '', email:'',points:0},player2: null, player3: null,player4:null }

}
