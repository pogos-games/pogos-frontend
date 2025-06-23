import {Component, effect, EffectRef, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {GameHistoryCardComponent} from "../../games/game-history-card/game-history-card.component";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {PageResponseDto} from "../../../model/dto/response/page-response.dto";
import {GameHistoryResponse} from "../../../model/dto/response/game-history-response.interface";
import {EMPTY_PAGE_RESPONSE} from "../../../model/dto/response/game-history-empty-page-response.dto";

@Component({
  selector: 'app-game-history-table',
  imports: [
    GameHistoryCardComponent,
    NzPaginationComponent
  ],
  template:`
    <div id="history-table">
      <h1>Dernières parties :</h1>
      @if(gamesHistory() && gamesHistory().data.length > 1){
        @for(game of  gamesHistory().data; track game){
          <app-game-history-card [gameHistory]="game"></app-game-history-card>
        }
        <nz-pagination
          [nzPageIndex]="currentPage"
          [nzPageSize]="pageSize"
          [nzTotal]="itemCount"
          (nzPageIndexChange)="this.onPageChange.emit($event)"
          nzSimple>
        </nz-pagination>
      } @else {
        <h2>Aucune partie trouvée 🥺</h2>
      }
    </div>
  `,
  styles:`
    h1{
      font-size: x-large;
      color: var(--primary-text-color);
    }

    h1,h2{
      font-family: "Lilita One", cursive;
    }

    #history-table{
      background-color: var(--secondary-bg-color);
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-content: space-evenly;
      width: 100%;
      height: 100%;

      @media screen and (max-width: 992px) {
        #history-table{
          width: 90%;
        }
      }
    }`
})
export class GameHistoryTableComponent {

  currentPage = 1;
  pageSize = 5;
  itemCount = 0;

  @Input({required:true}) gamesHistory: WritableSignal<PageResponseDto<GameHistoryResponse>>  = signal(EMPTY_PAGE_RESPONSE);

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  private readonly _gamesHistoryEffect : EffectRef = effect(() => {
    const response = this.gamesHistory();
    this.currentPage = response.meta.page;
    this.pageSize = response.meta.take;
    this.itemCount = response.meta.itemCount;
  });


}
