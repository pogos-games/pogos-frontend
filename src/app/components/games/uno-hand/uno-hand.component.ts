import {Component} from '@angular/core';
import {UnoCardComponent} from "../uno-card/uno-card.component";

@Component({
  selector: 'app-uno-hand',
  imports: [
    UnoCardComponent
  ],
  templateUrl: './uno-hand.component.html',
  styleUrl: './uno-hand.component.scss'
})
export class UnoHandComponent {

}
