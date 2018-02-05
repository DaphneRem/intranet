import { Component, OnInit } from '@angular/core';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';
// import { OpenNavbar, CloseNavbar, ShowNavbarState } from '@ab/root/src/+state/navbar.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers : [
    Store
  ]
})

export class AppComponent implements OnInit {

  constructor(
        private store: Store<Navbar>
  ) {
    this.navbarStoreOpen = this.store;
  }

  public navbar;
  public navbarStoreOpen;
  public navbarState;
  public windowWidth;
  public marginTop = '56px';
  public paddingTop;
  public marginLeft;
  public title = 'app0';
  public logo = 'logoABintranet';
  public headerNav = false;

  ngOnInit() {
    // check navbar.open state from store
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    this.checkHeader(this.navbarState);
  }
  // get the event headerNav from root-header component
  checkHeaderNav(event) {
    this.headerNav = event;
    console.log(this.headerNav);
  }

  onClick() {
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    if (this.navbarState) {
      this.marginLeft = '235px';
    } else {
      this.marginLeft = '0px';
    }
  }

  onResize(event) {
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    this.setMarginLeft(this.navbarState);
    this.checkHeader(this.navbarState);
  }

  setMarginLeft(nav) {
   if (nav) {
      this.marginLeft = '235px';
    } else {
      this.marginLeft = '0px';
    }
  }

  checkHeader(nav) {
    if (innerWidth >= 992) {
      return this.headerNav = false;
    } else if (innerWidth < 992 && nav === false) {
      this.headerNav = true;
      // changer padding top
      this.paddingTop = '0px';
    }
  }

}


