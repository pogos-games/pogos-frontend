import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { MyFriendsComponent } from '../my-friends/my-friends.component';
import { AddFriendComponent } from '../add-friend/add-friend.component';

@Component({
  selector: 'app-friends',
  imports: [
    NzTabsModule,
    MyFriendsComponent,
    AddFriendComponent
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {

  constructor() { }

}
