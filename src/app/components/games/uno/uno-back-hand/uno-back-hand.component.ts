import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";

@Component({
  selector: 'app-uno-back-hand',
  imports: [
    NgClass,
    UnoCardBackComponent
  ],
  templateUrl: './uno-back-hand.component.html',
  standalone: true,
  styleUrl: './uno-back-hand.component.scss'
})
export class UnoBackHandComponent {


  @Input({required:true}) direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  @Input({required: true}) handCount: number = 0;

  protected readonly Array = Array;

  get displayedCardCount(): number {
    return this.handCount > 7 ? 7 : this.handCount;
  }
}
