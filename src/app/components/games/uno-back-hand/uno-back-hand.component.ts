import {Component, Input} from '@angular/core';
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-uno-back-hand',
  imports: [
    UnoCardBackComponent,
    NgClass
  ],
  templateUrl: './uno-back-hand.component.html',
  styleUrl: './uno-back-hand.component.scss'
})
export class UnoBackHandComponent {


  @Input({required:true}) direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

}
