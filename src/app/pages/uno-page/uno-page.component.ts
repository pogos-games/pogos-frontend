import {Component, signal} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {UnoTableComponent} from "../../components/games/uno-table/uno-table.component";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";

@Component({
  selector: 'app-uno-page',
  imports: [
    HeaderComponent,
    UnoTableComponent,
    ChatComponent,
    NzDividerComponent
  ],
  templateUrl: './uno-page.component.html',
  styleUrl: './uno-page.component.scss'
})
export class UnoPageComponent {

  protected readonly signal = signal;

}
