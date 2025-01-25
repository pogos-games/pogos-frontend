import {Component, OnInit} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {Router, RouterLink} from "@angular/router";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";

@Component({
    selector: 'app-home-page',
    standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink,
    NzColDirective,
    NzRowDirective
  ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  constructor(private readonly userAuthService:UserAuthService, private readonly router:Router) {
  }

  ngOnInit() {
    if(this.userAuthService.isUserLoggedIn()) {
      this.router.navigateByUrl('/games')
    }
    this.userAuthService.updateToken().subscribe((tokenUpdated:boolean) => {
      if(tokenUpdated) this.router.navigateByUrl('/games')
    })
  }

}
