import {Component, inject, signal} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {UnoTableComponent} from "../../components/games/uno/uno-table/uno-table.component";
import {UnoService} from "../../services/uno.service";
import {GameType} from "../../model/enum/game-type.enum";
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

  protected readonly unoService:UnoService = inject(UnoService)

  protected readonly signal = signal;

  protected readonly GameType = GameType;
}
