import { Component, OnInit } from '@angular/core';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

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

  onClickedOutsideSidebar(e: Event) {
    if ((innerWidth < 992 && this.navbarState) {
      this.navbarState = false;
    }
  }
}
