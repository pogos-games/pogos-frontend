import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/common/header/header.component";
import {PogosButton} from "../../components/common/pogos-button/pogos-button.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    HeaderComponent,
    PogosButton,
    RouterLink,
    NzDividerModule,
    NzRowDirective,
    NzColDirective,
    RouterOutlet
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
}
