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
  navbarStoreOpen;
  navbarState: boolean;
  windowWidth;
  marginTop = '56px';
  paddingTop: string;


  // propertyValue = Store.getValue().path.to.state.property;
  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
    // this.navbarStoreOpen = this.store.select('open');
    // this.navbarStoreOpen = this.store.select('open');
    // this.getState();
    // console.log(Object.keys(this.store));
    if (innerWidth < 992) {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
      this.paddingTop = '56px';
    }
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    console.log(this.navbarState);
  }

    getState() {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    }

  onClick() {
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    if (this.navbarState) {
      return 'navbar-open';
    }
    //  this.navbarState = state;
      //  console.log(this.navbarState);
      // this.navbarStoreOpen = this.store.dispatch({ type: 'SHOW_NAVBAR_STATE' });

  }
onResize(event) {
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.windowWidth < 768) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
      // this.navBarState.emit(false);
    }
  }


  onClickedOutsideSidebar(e: Event) {
    console.log('coucou');
    if (innerWidth < 992 && this.navbarState === true) {
      // return this.navbarState = false;
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
      this.store.subscribe(data => (this.navbar = data));
      this.navbarState = this.navbar.navbar.open;
      console.log(this.navbarState);

    }
  }
}
