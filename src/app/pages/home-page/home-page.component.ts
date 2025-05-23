import {Component, inject, OnInit} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {Router, RouterLink} from "@angular/router";
import {UserAuthService} from "../../services/auth/user-auth.service";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {ThemeButtonComponent} from "../../components/common/theme-button/theme-button.component";

@Component({
    selector: 'app-home-page',
    standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink,
    NzColDirective,
    NzRowDirective,
    ThemeButtonComponent
  ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  private readonly userAuthService: UserAuthService = inject(UserAuthService);
  private readonly router: Router = inject(Router);

  ngOnInit() {

    if(this.userAuthService.isUserLoggedIn()) {
      this.router.navigateByUrl('/games')
    }
    this.userAuthService.updateToken().subscribe((tokenUpdated:boolean) => {
      if(tokenUpdated) this.router.navigateByUrl('/games')
    })
  }

}
