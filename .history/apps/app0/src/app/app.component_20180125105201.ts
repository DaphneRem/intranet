import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {

  public navbarState: boolean;

  constructor() { }

  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
  }

  onClick(state: boolean): void {
   this.navbarState = state;
   console.log(this.navbarState);
  }

  // navMargin() => navbarState ? '' 

}
