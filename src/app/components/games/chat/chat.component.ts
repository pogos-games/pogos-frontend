import {Component, Input, signal, WritableSignal} from '@angular/core';
import {NzDrawerComponent, NzDrawerContentDirective} from "ng-zorro-antd/drawer";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-chat',
    imports: [
        NzDrawerComponent,
        NzDrawerContentDirective,
        NzInputGroupComponent,
        NzInputDirective,
        NzButtonComponent,
        NzIconDirective,
        FormsModule
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Input({required: true}) visible: WritableSignal<boolean> = signal(false);

  protected message:string = '';

  close(): void {
    this.visible.set(false);
  }

  sendMessage() {
    console.log(this.message);
    this.message = '';
  }


}
