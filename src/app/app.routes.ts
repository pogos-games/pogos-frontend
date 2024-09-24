import { Routes } from '@angular/router';
import {ProfilePageComponent} from "./profile/profile-page/profile-page.component";
import {AuthGuard} from "./auth/guard/auth.guard";

export const routes: Routes = [
  { path:'profile', component:ProfilePageComponent, canActivate: [AuthGuard] },
];
