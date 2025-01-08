import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../components/header/header.component";
import {RankingComponent} from "../../components/ranking/ranking.component";

@Component({
    selector: 'app-game-page',
    imports: [
        NgOptimizedImage,
        NzButtonComponent,
        RouterLink,
        HeaderComponent,
        RankingComponent
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

  protected title = 'BlackJack';

  onTitleChange(title: string): void {
    this.title = title;
  }

}
