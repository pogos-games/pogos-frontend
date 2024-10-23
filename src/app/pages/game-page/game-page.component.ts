import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzButtonComponent
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
