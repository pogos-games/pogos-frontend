import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatMessage} from "../../../model/dto/chat-message.dto";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from "ng-zorro-antd/input";
import {NgClass} from "@angular/common";
import {UserAuthService} from "../../../services/auth/user-auth.service";
import {GameService} from "../../../services/games/game.service";
import {GatewayEventEmitter} from "../../../model/dto/game/enum/gateway/gateway-event-emitter.enum";
import {Subscription} from "rxjs";

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
export class ChatComponent implements OnInit, OnDestroy{

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  @Input({required: true})
  gameService!: GameService<any, any, any, any>;
  protected userAuthService : UserAuthService = inject(UserAuthService);
  messages: WritableSignal<ChatMessage[]> = signal([]);
  username: string = this.userAuthService.user().pseudo;
  currentMessage = ''
  sub = new Subscription();


  ngOnInit() {
    this.sub = this.gameService.listenChatUpdate().subscribe((message : ChatMessage) => {
      console.log('chat received : ',message)
      this.messages().push(message);
      this.scrollToBottom();
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  sendMessage() {
    if(!this.currentMessage.trim()){
      return;
    }
    const chatMessage: ChatMessage = {gameId: this.gameService.getGameId()!, username: this.username, text: this.currentMessage};
    this.gameService.sendMessage(GatewayEventEmitter.CHAT, chatMessage);
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
