import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzSpinComponent } from "ng-zorro-antd/spin";
import { GameDeck } from "../../../../model/dto/request/game-deck";
import { Card } from "../../../../model/dto/request/card";
import { CardHandComponent } from "../../card-hand/card-hand.component";
import { GameActions } from "../../../../model/enum/game.actions.enum";
import { GameTableComponent } from '../game-table.component';

@Component({
    selector: 'app-game-table',
    imports: [
        NgOptimizedImage,
        NzButtonComponent,
        NzSpinComponent,
        CardHandComponent
    ],
    templateUrl: './game-table-poker.component.html',
    standalone: true,
    styleUrl: './game-table-poker.component.scss'
})
export class GameTablePokerComponent extends GameTableComponent {
}