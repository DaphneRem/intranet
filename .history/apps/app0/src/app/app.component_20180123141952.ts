import { Component } from '@angular/core';
import { Globals } from '../../../../libs/globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Globals]

})
export class AppComponent {
  logo: string;

  constructor(
    private globals: Globals
  ) { }

  title = 'app0';
  links = this.globals.links;

}
