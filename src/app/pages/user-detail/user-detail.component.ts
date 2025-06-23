import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserResponseDto} from "../../model/dto/response/user-response.dto";
import {UserService} from "../../services/user.service";
import {HeaderComponent} from "../../components/common/header/header.component";
import {NgOptimizedImage} from "@angular/common";
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {HistoryService} from "../../services/history.service";
import {GameHistoryResponse} from "../../model/dto/response/game-history-response.interface";
import {PageResponseDto} from "../../model/dto/response/page-response.dto";
import {GameHistoryTableComponent} from "../../components/common/game-history-table/game-history-table.component";
import {EMPTY_PAGE_RESPONSE} from "../../model/dto/response/game-history-empty-page-response.dto";

@Component({
  selector: 'app-user-detail',
  imports: [
    HeaderComponent,
    NgOptimizedImage,
    NzBadgeComponent,
    GameHistoryTableComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  protected user = signal<UserResponseDto | undefined>(undefined);
  protected gamesHistory : WritableSignal<PageResponseDto<GameHistoryResponse>> = signal(EMPTY_PAGE_RESPONSE)

  private readonly route : ActivatedRoute = inject(ActivatedRoute);
  private readonly userService : UserService = inject(UserService);
  private readonly historyService : HistoryService = inject(HistoryService);

  private readonly userId = this.route.snapshot.paramMap.get('id');

  pageSize = 5; // Number of users to display per page
  currentPage = 1; // Current page number
  itemCount = 0;

  ngOnInit(): void {

    if (this.userId !== null) {

      this.userService.getUserById(this.userId).subscribe({
        next: (data) => this.user.set(data),
        error: (err) => console.error('Erreur lors de la récupération de l’utilisateur', err)
      });
      this.findHistoryByUserId();
    }
  }

  findHistoryByUserId() {
    if (this.userId) {
      this.historyService.findHistoryByUserId(this.userId, this.currentPage, this.pageSize).subscribe({
        next: (page: PageResponseDto<GameHistoryResponse>) => {
          this.gamesHistory.set(page);
        }
      });
    }
  }

  onPageChange(pageNumber: number){
    this.currentPage = pageNumber;
    this.findHistoryByUserId();
  }
}

