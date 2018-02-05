import { Component } from '@angular/core';
import { Globals } from '../../../../libs/globals';
import * as logo from 'app0/src/app/assets/logoABintranet.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Globals]

})
export class AppComponent {

  constructor(
    private globals: Globals
  ) { }

  title = 'app0';
  links = this.globals.links;

}
