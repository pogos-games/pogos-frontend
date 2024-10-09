import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NzButtonComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  protected username: string | undefined ;

  constructor(private keycloakService:KeycloakService){}

  ngOnInit(){
    this.username = this.keycloakService.getUsername()
  }


  logout() {
    return this.keycloakService.logout(window.location.origin)
  }




}
