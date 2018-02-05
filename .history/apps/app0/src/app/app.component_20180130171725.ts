import { Component, OnInit } from '@angular/core';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';


import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import {
  OpenNavbar,
  CloseNavbar,
  ShowNavbarState
} from '../../../../libs/root/src/+state/navbar.actions';
import { Navbar } from '../../../../libs/root/src/+state/navbar.interfaces';
import { navbarInitialState } from '../../../../libs/root/src/+state/navbar.init';
import { navbarReducer } from '../../../../libs/root/src/+state/navbar.reducer';


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
  public navbarState: boolean;
  public windowWidth;
  public marginTop = '56px';
  public paddingTop: string;
  public marginLeft;
  public title = 'app0';
  public logo = 'logoABintranet';

  ngOnInit() {
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    console.log('appComponent OnInit navbarState : ' + this.navbarState);
  }


  onClick() {
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    if (this.navbarState) {
      this.marginLeft = '235px';
      return 'navbar-open';
    } else {
      this.marginLeft = '0px';
    }
  }

onResize(event) {
  this.store.subscribe(data => (this.navbar = data));
  this.navbarState = this.navbar.navbar.open;
  console.log('onResize appComponent navbarState : ' +  this.navbarState);
  if (this.navbarState) {
    this.marginLeft = '235px';
  } else {
    this.marginLeft = '0px';
  }

  }


  // onClickedOutsideSidebar(e: Event) {
  //   console.log('coucou');
  //   if (innerWidth < 992 && this.navbarState === true) {
  //     // return this.navbarState = false;
  //     this.store.dispatch({ type: 'CLOSE_NAVBAR' });
  //     this.store.subscribe(data => (this.navbar = data));
  //     this.navbarState = this.navbar.navbar.open;
  //     console.log(this.navbarState);

  //   }
  // }
}