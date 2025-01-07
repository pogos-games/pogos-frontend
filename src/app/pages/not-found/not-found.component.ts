import { Component } from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzResultComponent} from "ng-zorro-antd/result";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink,
    NzResultComponent
  ],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

}
