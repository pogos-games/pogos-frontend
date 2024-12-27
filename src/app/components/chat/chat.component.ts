import {Component, Input, signal, WritableSignal} from '@angular/core';
import {NzDrawerComponent, NzDrawerContentDirective} from "ng-zorro-antd/drawer";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NzDrawerComponent,
    NzDrawerContentDirective,
    NzInputGroupComponent,
    NzInputDirective,
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Input({required: true}) visible: WritableSignal<boolean> = signal(false);

  close(): void {
    this.visible.set(false);
  }

}
