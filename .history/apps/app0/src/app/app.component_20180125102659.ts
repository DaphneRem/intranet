import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {
  @Output() verticalNavType: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  title = 'app0';
  logo = 'logoABintranet';
}
