import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {HistoryService} from "../../../../services/history.service";
import {PageResponseDto} from "../../../../model/dto/response/page-response.dto";
import {GameHistoryResponse} from "../../../../model/dto/response/game-history-response.interface";
import {EMPTY_PAGE_RESPONSE} from "../../../../model/dto/response/game-history-empty-page-response.dto";
import {UserAuthService} from "../../../../services/auth/user-auth.service";
import {GameHistoryTableComponent} from "../../../common/game-history-table/game-history-table.component";

@Component({
  selector: 'app-history',
  imports: [
    GameHistoryTableComponent
  ],
  templateUrl: './game-history.component.html',
})
export class GameHistoryComponent implements OnInit {

  private readonly historyService = inject(HistoryService);
  protected userAuthService : UserAuthService = inject(UserAuthService);

  protected gamesHistory : WritableSignal<PageResponseDto<GameHistoryResponse>> = signal(EMPTY_PAGE_RESPONSE);

  private currentPage = 1;
  private readonly pageSize = 5

  ngOnInit() {
    this.findHistoryByUserId();
  }

  findHistoryByUserId() {
      this.historyService.findHistoryByUserId(this.userAuthService.user().id, this.currentPage, this.pageSize).subscribe({
        next: (page: PageResponseDto<GameHistoryResponse>) => {
          this.gamesHistory.set(page);
        }
      });
    }

  onPageChange(pageIndex:number){
    this.currentPage = pageIndex;
    this.findHistoryByUserId();
  }

}
