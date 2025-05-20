import { Component, OnInit, Signal, signal } from '@angular/core';
import { FriendshipResponseDto } from '../../../../../model/dto/response/friendship-response.dto';
import { User } from '../../../../../model/user.interface';
import { FriendshipService } from '../../../../../services/friendship.service';
import { UserAuthService } from '../../../../../services/auth/user-auth.service';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.scss'
})
export class MyFriendsComponent implements OnInit {

  user: Signal<User> = this.userAuthService.user;

  // Liste des amis en tant que signal
  friends = signal<FriendshipResponseDto[]>([]);

  constructor(private readonly friendshipService: FriendshipService, private readonly userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.getFriends(); // Appelé automatiquement au montage du composant
  }

  // Récupérer la liste des amis
  getFriends(): void {
    this.friendshipService.getFriendship(this.user().id).subscribe({
      next: (response: FriendshipResponseDto[]) => {
        this.friends.set(response);
      },
      error: (error) => {
        console.error('Error fetching friends:', error);
      }
    });
  }

  // Supprimer un ami
  rejectFriendship(friendshipId: string): void {
    console.log('friends', this.friends());
    this.friendshipService.rejectFriendship(friendshipId).subscribe({
      next: () => {
        this.friends.set(this.friends().filter(friend => friend.friendshipId !== friendshipId));
      },
      error: (error) => {
        console.error('Error rejecting friendship:', error);
      }
    });
  }
}
