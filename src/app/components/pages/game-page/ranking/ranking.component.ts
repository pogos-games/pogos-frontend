import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserResponseDto} from "../../../../model/dto/response/user-response.dto";
import {RankingService} from "../../../../services/ranking.service";
import {UserCardComponent} from "../../../common/user-card/user-card.component";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {PageResponseDto} from "../../../../model/dto/response/page-response.dto";

@Component({
  selector: 'app-ranking',
  standalone: true,
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
  imports: [
    UserCardComponent,
    NzPaginationComponent
  ]
})
export class RankingComponent implements OnInit {

  private readonly rankingService = inject(RankingService);

  protected users: WritableSignal<UserResponseDto[]> = signal([]);

  pageSize = 5; // Number of users to display per page

  currentPage = 1; // Current page number

  itemCount = 0;

  ngOnInit() {
    this.findUsersByPage();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findUsersByPage();
  }

  findUsersByPage() {
    this.rankingService.getUsersByRanking(this.currentPage, this.pageSize).subscribe((page: PageResponseDto<UserResponseDto>) => {
      const sortedUsers = [...page.data].sort((a: UserResponseDto, b: UserResponseDto) => b.points - a.points);
      this.currentPage = page.meta.page;
      this.itemCount = page.meta.itemCount;
      this.users.set(sortedUsers);
    });
  }

}
