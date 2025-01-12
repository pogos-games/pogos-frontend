import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {GamePageComponent} from "./pages/game-page/game-page.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {BlackjackPageComponent} from "./pages/blackjack-page/blackjack-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SignupPageComponent} from "./pages/signup-page/signup-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {AuthGuard} from "./auth/guard/auth-guard";

export const routes: Routes = [
  { path:'games', component:GamePageComponent},
  {path:'games/blackjack', component:BlackjackPageComponent},
  {path:'login',component:LoginPageComponent},
  {path:'signup',component:SignupPageComponent},
  { path:'profile', component: ProfilePageComponent, canActivate:[AuthGuard]},
  { path: '', component:HomePageComponent},
  {path:'**', component:NotFoundComponent}
];
