import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzBadgeComponent} from "ng-zorro-antd/badge";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-jeton-button',
  imports: [
    NgOptimizedImage,
    NzBadgeComponent,
    NzDividerComponent,
    NgIf
  ],
  templateUrl: './jeton-button.component.html',
  standalone: true,
  styleUrl: './jeton-button.component.scss'
})
export class JetonButtonComponent {
    @Output() placeBet = new EventEmitter<number>();
    @Input({required : true}) playerBalance: number = 0;
    @Input({required : true}) playerBet: number = 0;
    @Input() coins: boolean = true;
}
