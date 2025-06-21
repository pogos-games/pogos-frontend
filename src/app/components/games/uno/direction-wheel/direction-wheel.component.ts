import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnoGameDirection} from "../../../../model/dto/uno/enum/uno-game-direction.enum";

@Component({
  selector: 'app-direction-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="loader" [ngClass]="{'counterclockwise': direction === UnoGameDirection.COUNTERCLOCKWISE}"></span>`,
  styles: [`
    .loader {
      width: 48px;
      height: 48px;
      display: inline-block;
      position: relative;
      border-width: 3px 2px 3px 2px;
      border-style: solid dotted solid dotted;
      border-color: #de3500 rgba(255, 255, 255, 0.3) #fff rgba(151, 107, 93, 0.3);
      border-radius: 50%;
      box-sizing: border-box;
      animation: 2s rotate linear infinite;
    }

    .loader:before,
    .loader:after {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      border: 10px solid transparent;
      transform: rotate(-35deg);
    }

    //.loader:before {
    //  border-bottom-color: #fff;
    //  transform: translate(-10px, 19px) rotate(-35deg);
    //}
    //
    //.loader:after {
    //  border-color: #de3500 transparent transparent transparent;
    //  transform: translate(32px, 3px) rotate(-35deg);
    //}

    .loader.counterclockwise {
      animation: 2s rotate-ccw linear infinite;
    }
    //
    //.loader.counterclockwise {
    //  border-bottom-color: #de3500;
    //  transform: translate(32px, 3px) rotate(145deg);
    //}

    //.loader.counterclockwise:after {
    //  border-color: #fff transparent transparent transparent;
    //  transform: translate(-10px, 19px) rotate(145deg);
    //}

    @keyframes rotate {
      100% { transform: rotate(360deg); }
    }

    @keyframes rotate-ccw {
      100% { transform: rotate(-360deg); }
    }
  `]
})
export class DirectionWheelComponent {
  @Input({}) direction: UnoGameDirection = UnoGameDirection.CLOCKWISE;
  UnoGameDirection = UnoGameDirection; // used by the template for ngClass
}
