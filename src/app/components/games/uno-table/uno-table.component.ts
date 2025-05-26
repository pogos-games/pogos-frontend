import { Component } from '@angular/core';
import {UnoHandComponent} from "../uno-hand/uno-hand.component";
import {UnoCardComponent} from "../uno-card/uno-card.component";
import {UnoCardBackComponent} from "../uno-card-back/uno-card-back.component";
import {UnoBackHandComponent} from "../uno-back-hand/uno-back-hand.component";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-uno-table',
  imports: [
    UnoHandComponent,
    UnoCardComponent,
    UnoCardBackComponent,
    UnoBackHandComponent,
    NzIconDirective
  ],
  templateUrl: './uno-table.component.html',
  styleUrl: './uno-table.component.scss'
})
export class UnoTableComponent {

}
