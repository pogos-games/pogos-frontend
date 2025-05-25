import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {UnoTableComponent} from "../../components/games/uno-table/uno-table.component";

@Component({
  selector: 'app-uno-page',
  imports: [
    HeaderComponent,
    UnoTableComponent
  ],
  templateUrl: './uno-page.component.html',
  styleUrl: './uno-page.component.scss'
})
export class UnoPageComponent {


}
