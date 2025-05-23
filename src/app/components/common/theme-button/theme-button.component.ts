import {Component, inject} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-theme-button',
  imports: [
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './theme-button.component.html',
  styleUrl: './theme-button.component.scss'
})
export class ThemeButtonComponent {


  protected readonly themeService = inject(ThemeService);

}
