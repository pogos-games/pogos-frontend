   import { Routes } from '@angular/router';
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {AuthGuard} from "./auth/guard/auth.guard";
   import {HomePageComponent} from "./home-page/home-page.component";

export const routes: Routes = [
  { path:'profile', component:ProfilePageComponent, canActivate: [AuthGuard] },
  { path: '', component:HomePageComponent}
];
