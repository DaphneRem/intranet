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
  ) { }

  public navbarState: boolean;
  navbarStoreOpen;

  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
    // this.navbarState = this.store.select('open');
    // console.log(this.store.dispatch({ type: 'SHOW_NAVBAR_STATE' }));
  }


  onClick(): void {
  //  this.navbarState = state;
  //  console.log(this.navbarState);
  this.navbarStoreOpen = this.store.dispatch({ type: "SHOW_NAVBAR_STATE" });
  console.log(this.navbarStoreOpen.open);
  }

  onClickedOutsideSidebar(e: Event) {
    console.log('coucou');
    if (innerWidth < 992 && this.navbarState === true) {
      return this.navbarState = false;
    }
  }
}
