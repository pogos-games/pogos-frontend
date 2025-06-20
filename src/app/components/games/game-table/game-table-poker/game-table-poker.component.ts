import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { CardHandComponent } from "../../card-hand/card-hand.component";
import { GameTableComponent } from '../game-table.component';

@Component({
    selector: 'app-game-table',
    imports: [
        NgOptimizedImage,
        CardHandComponent
    ],
    templateUrl: './game-table-poker.component.html',
    standalone: true,
    styleUrl: './game-table-poker.component.scss'
})
export class GameTablePokerComponent extends GameTableComponent {
}
