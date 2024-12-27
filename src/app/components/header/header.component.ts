import {Component} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMenuDirective, NzMenuGroupComponent, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzMenuItemComponent,
    NzMenuDirective,
    NzSubMenuComponent,
    NzIconModule,
    NzMenuGroupComponent,
    RouterLink
  ],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {


}
