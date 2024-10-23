import { Component } from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSpaceItemDirective} from "ng-zorro-antd/space";
import {NzImageDirective} from "ng-zorro-antd/image";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzSpaceItemDirective,
    NzImageDirective
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
