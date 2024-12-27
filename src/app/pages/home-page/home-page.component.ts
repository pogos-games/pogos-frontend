import { Component } from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSpaceItemDirective} from "ng-zorro-antd/space";
import {NzImageDirective} from "ng-zorro-antd/image";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzSpaceItemDirective,
    NzImageDirective,
    RouterLink
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
