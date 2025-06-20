import {Component, EventEmitter, Output} from '@angular/core';
import {NzInputDirective} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-box-join-code',
  imports: [
    NzInputDirective,
    FormsModule
  ],
  templateUrl: './box-join-code.component.html',
  standalone: true,
  styleUrl: './box-join-code.component.scss'
})
export class BoxJoinCodeComponent {
  @Output() searchGameEvent: EventEmitter<string> = new EventEmitter<string>();

  joinCode: string = ""
  searchGame() {
    const code = this.joinCode.trim();
    if (code) {
      this.searchGameEvent.emit(code);
    }
  }
}
