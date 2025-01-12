import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule],
    templateUrl: './app.component.html'
})
export class AppComponent {
}
