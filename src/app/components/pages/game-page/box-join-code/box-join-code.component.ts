import {Component, EventEmitter, inject, Output} from '@angular/core';
import {NzInputDirective} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";

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

  private readonly nzNotificationService : NzNotificationService = inject(NzNotificationService);

  joinCode: string = ""
  searchGame() {
    const code = this.joinCode.trim().replace(/^#/, '');
    // remove # from code
    if (code && code.length === 4) {
      this.searchGameEvent.emit(code);
    } else{
      console.log('erreur')
        this.nzNotificationService.create('error', 'Erreur', 'Le code saisi est invalide (ex: #4849)', {
          nzClass: 'custom-notification',
          nzDuration: 5000
        });
      }
}


}
