import {Component} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-game-buttons',
  imports: [
    NzButtonComponent,
    RouterLink
  ],
  templateUrl: './game-buttons.component.html',
  styleUrl: './game-buttons.component.scss'
})
export class GameButtonsComponent {

  protected title:string = 'Blackjack';

}
