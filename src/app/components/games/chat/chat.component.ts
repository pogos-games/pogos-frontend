import {Component, ElementRef, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatMessage} from "../../../model/dto/chat-message.dto";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from "ng-zorro-antd/input";
import {NgClass} from "@angular/common";
import {UnoService} from "../../../services/uno.service";
import {UserAuthService} from "../../../services/auth/user-auth.service";

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  protected unoService : UnoService = inject(UnoService);

  protected userAuthService : UserAuthService = inject(UserAuthService);

  messages: WritableSignal<ChatMessage[]> = signal([]);

  username: string = this.userAuthService.user().pseudo;

  currentMessage = ''

  constructor() {
    this.unoService.listenToTopic<ChatMessage>('CHAT').subscribe((message : ChatMessage) => {
      console.log('chat received : ',message)
      this.messages().push(message);
      this.scrollToBottom();
    })
  }

  sendMessage() {
    if(!this.currentMessage.trim()){
      return;
    }
    const chatMessage: ChatMessage = {gameId: this.unoService.getGameId()!, username: this.username, text: this.currentMessage};
    this.unoService.sendMessage('CHAT', chatMessage);
    this.currentMessage = '';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }



}
