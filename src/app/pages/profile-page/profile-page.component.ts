import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {PogosButton} from "../../components/pogos-button/pogos-button.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {NzDividerModule} from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    HeaderComponent,
    PogosButton,
    RouterOutlet,
    RouterLink,
    NzDividerModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
}
