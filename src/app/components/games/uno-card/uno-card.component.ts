import {Component, Input} from '@angular/core';
import {UnoCard, UnoCardColor, UnoCardType} from "../../../model/dto/uno/uno-card.interface";
import {NgClass} from "@angular/common";


@Component({
  selector: 'app-uno-card',
  templateUrl: './uno-card.component.html',
  styleUrls: ['./uno-card.component.scss'],
  standalone: true,
  imports: [
    NgClass
  ]
})
export class UnoCardComponent {

  @Input({required:true}) card: UnoCard = {'color': UnoCardColor.Blue, 'type': UnoCardType.Number, 'value': 0};

  protected readonly UnoCardType = UnoCardType;
}
