import { Injectable } from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class BlackjackService extends GameService{
  protected override gameUrl = "blackjack"
}

