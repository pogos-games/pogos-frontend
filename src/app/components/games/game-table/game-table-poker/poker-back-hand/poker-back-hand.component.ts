import {Component, Input} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-poker-back-hand',
  imports: [
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './poker-back-hand.component.html',
  standalone: true,
  styleUrl: './poker-back-hand.component.scss'
})
export class PokerBackHandComponent {


  @Input() direction: 'horizontal' | 'vertical' = 'vertical';

  @Input({required: true}) handCount: number = 0;

  protected readonly Array = Array;
}
