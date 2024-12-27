import { Component } from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink
  ],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

}
