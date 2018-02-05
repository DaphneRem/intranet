import { Component, OnInit } from '@angular/core';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {

  public navbarState: boolean;
  public windowsWith: number;

  constructor() { }

  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
  this.setNavbar();
  }


  setNavbar() {
    this.windowsWith = innerWidth;
    if (this.windowsWith >= 768 && this.windowsWith <= 1024) {
      this.navbarState = false;
    } else if (this.windowsWith < 768) {
      this.navbarState = false;
    } else {
      this.navbarState = true;
    }
  }

  onClick(state: boolean): void {
   this.navbarState = state;
   console.log(this.navbarState);
  }

}
