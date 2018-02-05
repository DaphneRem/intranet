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

  public navbarState;
  navbarStoreOpen;

  // propertyValue = Store.getValue().path.to.state.property;
  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
    // this.navbarStoreOpen = this.store.select('open');
    // this.navbarStoreOpen = this.store.select('open');
    // this.getState();
    console.log(Object.keys(this.store));
    this.store.subscribe(data => (this.navbarState = data));
    console.log(this.navbarState.open);
  }

    getState() {
      this.store.dispatch({ type: 'SHOW_NAVBAR_STATE' });
    }

  // onClick(): void {
  // //  this.navbarState = state;
  // //  console.log(this.navbarState);
  // this.navbarStoreOpen = this.store.dispatch({ type: "SHOW_NAVBAR_STATE" });
  // console.log(this.navbarStoreOpen.open);
  // }

  onClickedOutsideSidebar(e: Event) {
    console.log('coucou');
    if (innerWidth < 992 && this.navbarState === true) {
      return this.navbarState = false;
    }
  }
}
