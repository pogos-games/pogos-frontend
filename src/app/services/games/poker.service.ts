import { Injectable } from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class PokerService extends GameService{
  protected override gameUrl = "poker"
}

