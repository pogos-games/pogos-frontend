   import { Routes } from '@angular/router';
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {AuthGuard} from "./auth/guard/auth.guard";
   import {HomePageComponent} from "./pages/home-page/home-page.component";
   import {GamePageComponent} from "./pages/game-page/game-page.component";

export const routes: Routes = [
  { path:'profile', component:ProfilePageComponent, canActivate: [AuthGuard] },
  { path:'game', component:GamePageComponent},
  { path: '', component:HomePageComponent}
];
