import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { RouterLink } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { RankingComponent } from "../../components/ranking/ranking.component";
import { AuthService } from '../../auth/service/auth.service';
import { StorageService } from '../../services/storage/session-storage.service';

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

  constructor(private readonly authService: AuthService, private readonly storageService: StorageService) {
  }

  user: string | undefined = this.storageService.getUserStorage()?.pseudo ?? undefined;

  onTitleChange(title: string): void {
    this.title = title;
  }

  onClick(): void {
    this.authService.profile().subscribe({
      next: (response) => {
        console.log("Profil récupéré :", response); // Utilisez `response` pour afficher les données reçues
      },
      error: (error) => {
        console.error("Erreur lors de la récupération du profil :", error);
      },
    });
  }

}
