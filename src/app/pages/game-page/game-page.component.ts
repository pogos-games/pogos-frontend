import {Component} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {RankingComponent} from "../../components/ranking/ranking.component";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {PogosButton} from '../../components/pogos-button/pogos-button.component';
import {HeaderComponent} from "../../components/header/header.component";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink,
    HeaderComponent,
    RankingComponent,
    PogosButton
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent  {

  protected title = 'BlackJack';

  constructor(private readonly userAuthService: UserAuthService) {
  }

  user = this.userAuthService.user

  onTitleChange(title: string): void {
    console.log("title")
    this.title = title;
  }
}
