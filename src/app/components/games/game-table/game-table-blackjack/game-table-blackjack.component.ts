import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardHandComponent } from '../../card-hand/card-hand.component';
import { GameTableComponent } from '../game-table.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-table',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CardHandComponent,
    DragDropModule
  ],
  templateUrl: './game-table-blackjack.component.html',
  styleUrl: './game-table-blackjack.component.scss'
})

export class GameTableBlackjackComponent extends GameTableComponent {
  slot1 = [1]; // 1 jeton au début
  slot2: number[] = [];

  onDrop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
