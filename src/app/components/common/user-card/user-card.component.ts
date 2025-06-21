import {Component, Input} from '@angular/core';
import {UserResponseDto} from "../../../model/dto/response/user-response.dto";
import {Avatar} from "../../../model/dto/game/enum/avatar.enum";
import {NgOptimizedImage} from "@angular/common";
import {NzDividerComponent} from "ng-zorro-antd/divider";

@Component({
  selector: 'app-user-card',
  imports: [
    NgOptimizedImage,
    NzDividerComponent
  ],
  templateUrl: './user-card.component.html',
  standalone: true,
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input({required: true}) user: UserResponseDto = { id: '', username: '', avatar: Avatar.DEFAULT, points: 0 };

  @Input({required: true}) rank: number = 0;

}
