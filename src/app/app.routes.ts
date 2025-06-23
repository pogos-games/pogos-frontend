import {Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {GamePageComponent} from "./pages/game-page/game-page.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {BlackjackPageComponent} from "./pages/blackjack-page/blackjack-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SignupPageComponent} from "./pages/signup-page/signup-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {AuthGuard} from "./auth/guard/auth-guard";
import {MyProfileComponent} from './components/pages/profile/my-profile/my-profile.component';
import {FriendsComponent} from "./components/pages/profile/friends/main-friends/friends.component";
import {GameHistoryComponent} from "./components/pages/profile/history/game-history.component";
import {PokerPageComponent} from './pages/poker-page/poker-page.component';
import {UnoPageComponent} from "./pages/uno-page/uno-page.component";
import {UserDetailComponent} from "./pages/user-detail/user-detail.component";

export const routes: Routes = [
  { path: 'games', component: GamePageComponent },
  { path: 'games/blackjack', component: BlackjackPageComponent },
  { path: 'games/poker', component: PokerPageComponent },
  { path: 'games/uno', component: UnoPageComponent},
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent }, {
    path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'my-profile', pathMatch: 'full' },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'game-history', component: GameHistoryComponent }
    ]
  },
  {path: 'user/:id', component: UserDetailComponent},
  { path: '', component: HomePageComponent },
  { path: '**', component: NotFoundComponent }
];
