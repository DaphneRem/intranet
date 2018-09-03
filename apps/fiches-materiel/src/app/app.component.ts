import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AuthAdalService } from './auth-adal.service';
import { Adal5HTTPService, Adal5Service } from 'adal-angular5';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';

const config = {
  tenant: 'abtelevision.onmicrosoft.com',
  clientId: 'b0a2ddab-1af7-42ff-8764-41eb6fab8fe1'
    // tenant: 'adfs',
    // clientId: 'http://vm-angular-rc:9087',
    // instance: 'http://sts.groupe-ab.fr/'
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers : [
    Store,
    AuthAdalService
  ]
})

export class AppComponent implements OnInit {

  constructor(
    private store: Store<Navbar>,
    private authAdalService: AuthAdalService,
    private adal5Service: Adal5Service
  ) {
    this.navbarStoreOpen = this.store;
    this.adal5Service.init(config);
  }

  public navbar;
  public navbarStoreOpen;
  public navbarState;
  public windowWidth;
  public marginTop = '56px';
  public paddingTop;
  public marginLeft;
  public title = 'suivi-ingests';
  public logo = 'logoABintranet';
  public headerNav = false;

  ngOnInit() {
    // check navbar.open state from store
    this.store.subscribe(data => (this.navbar = data));
    this.navbarState = this.navbar.navbar.open;
    this.checkHeader(this.navbarState);

        // Handle callback if this is a redirect from Azure
    this.adal5Service.handleWindowCallback();

    // Check if the user is authenticated. If not, call the login() method
    if (!this.adal5Service.userInfo.authenticated) {
      this.adal5Service.login();
    }

    // Log the user information to the console
    console.log('username ' + this.adal5Service.userInfo.username);
    console.log('authenticated: ' + this.adal5Service.userInfo.authenticated);
    console.log('name: ' + this.adal5Service.userInfo.profile.name);
    console.log('token: ' + this.adal5Service.userInfo.token);
    console.log(this.adal5Service.userInfo.profile);
  }

  public logout(event) {
    if (event) {
      this.adal5Service.logOut();
    }
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


