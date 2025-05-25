import { Component } from '@angular/core';
import {UnoHandComponent} from "../uno-hand/uno-hand.component";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {UnoBackHandComponent} from "../uno-back-hand/uno-back-hand.component";

@Component({
  selector: 'app-uno-table',
  imports: [
    UnoHandComponent,
    UnoCardComponent,
    UnoCardBackComponent,
    UnoBackHandComponent
  ],
  templateUrl: './uno-table.component.html',
  styleUrl: './uno-table.component.scss'
})
export class UnoTableComponent {

}
