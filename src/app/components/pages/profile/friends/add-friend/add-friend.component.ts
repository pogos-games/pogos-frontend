import {Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil} from 'rxjs';
import {NzFormControlComponent, NzFormDirective} from 'ng-zorro-antd/form';
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {CommonModule} from '@angular/common';

import {User} from '../../../../../model/user.interface';
import {UserAuthService} from '../../../../../services/auth/user-auth.service';
import {UserService} from '../../../../../services/user.service';
import {FriendshipService} from '../../../../../services/friendship.service';
import {PageResponseDto} from '../../../../../model/dto/response/page-response.dto';
import {UserResponseDto} from '../../../../../model/dto/response/user-response.dto';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormControlComponent,
    NzFormDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzButtonModule,
    NzIconModule,
    NzPaginationModule,
    NzSpinModule,
    RouterLink
  ],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent implements OnInit, OnDestroy {
  addFriendForm: FormGroup = new FormGroup({
    friendPseudo: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'change'
    })
  });

  user: Signal<User> = this.userAuthService.user;
  users: UserResponseDto[] = [];
  meta: PageResponseDto<UserResponseDto>['meta'] | null = null;

  currentPage = 1;
  pageSize = 10;
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly userService: UserService, private readonly FriendshipService: FriendshipService, private readonly userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.addFriendForm.get('friendPseudo')!.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((value) => value && value.length >= 3),
        switchMap((pseudo) => {
          this.isLoading = true;
          this.currentPage = 1;
          return this.userService.getUserByName(pseudo, this.currentPage, this.pageSize);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.users = res.data.filter(user => user.id !== this.user().id);
          this.meta = res.meta;
          this.isLoading = false;
        },
        error: () => {
          this.users = [];
          this.meta = null;
          this.isLoading = false;
        }
      });
  }

  loadPage(page: number): void {
    const pseudo = this.addFriendForm.get('friendPseudo')?.value;
    if (!pseudo || pseudo.length < 3) return;

    this.isLoading = true;
    this.currentPage = page;

    this.userService.getUserByName(pseudo, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data.filter(user => user.id !== this.user().id);
        this.meta = res.meta;
        this.isLoading = false;
      },
      error: () => {
        this.users = [];
        this.meta = null;
        this.isLoading = false;
      }
    });
  }

  get shouldShowPagination(): boolean {
    return !!this.meta?.pageCount && this.meta.pageCount > 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendFriendRequest(userId: string): void {
    this.FriendshipService.sendFriendship(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
      },
      error: () => {
        // Handle error if needed
      }
    });
  }
}
