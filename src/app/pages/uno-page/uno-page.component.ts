import {Component, inject} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {UnoTableComponent} from "../../components/games/uno/uno-table/uno-table.component";
import {UnoService} from "../../services/uno.service";
import {GameType} from "../../model/enum/game-type.enum";
import {ChatComponent} from "../../components/games/chat/chat.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {ModalComponent} from "../../components/common/modal/modal.component";

@Component({
  selector: 'app-uno-page',
  imports: [
    HeaderComponent,
    UnoTableComponent,
    ChatComponent,
    NzDividerComponent,
    ModalComponent
  ],
  templateUrl: './uno-page.component.html',
  standalone: true,
  styleUrl: './uno-page.component.scss'
})
export class UnoPageComponent {

  protected gameService = inject(UnoService)

  protected GameType = GameType;

}
