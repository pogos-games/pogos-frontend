import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../components/header/header.component";
import {RankingComponent} from "../../components/ranking/ranking.component";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {PogosButton} from "../../components/pogos-button/pogos-button.component";

@Component({
  selector: 'app-game-page',
  imports: [
    NgOptimizedImage,
    NzButtonComponent,
    RouterLink,
    HeaderComponent,
    RankingComponent,
    PogosButton
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent implements OnInit {

  protected title = 'BlackJack';

  constructor(private readonly userAuthService:UserAuthService) {
  }

  username: string | undefined;

  onTitleChange(title: string): void {
    console.log("title")
    this.title = title;
  }

  ngOnInit() {
    if(this.userAuthService.isUserLoggedIn()) {
      this.username = this.userAuthService.getUsername();
    }
  }
}
