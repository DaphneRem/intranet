import { Component, OnInit, Compiler, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';


import { Adal5HTTPService, Adal5Service } from 'adal-angular5';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';

import { config } from './../../../../.privates-url';
import { AuthAdalService } from 'apps/fiches-materiel/src/app/auth-adal.service';
import { App } from 'apps/fiches-materiel/src/app/+state/app.interfaces';


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
    private compiler: Compiler,
    private store: Store<Navbar>,
    private appStore: Store<App>,
    private authAdalService: AuthAdalService,
    private adal5Service: Adal5Service,
    private router: Router,
    private _zone: NgZone
  ) {
    this.navbarStoreOpen = this.store;
    this.adal5Service.init(config);
  }

  public globalStore;
  public navbarStoreOpen;
  public navbarState;
  public windowWidth;
  public marginTop = '56px';
  public paddingTop;
  public marginLeft;
  public title = 'suivi-ingests';
  public logo = 'logoABintranet';
  public headerNav = false;
  public userName;
  public name;
  public user;
  public firstName: string;
  public lastName: string;
  public initials: string;

  ngOnInit() {
    console.log(this.adal5Service);
    console.log(this.authAdalService);
    console.log(this.adal5Service.userInfo);
    // Handle callback if this is a redirect from Azure
    this.adal5Service.handleWindowCallback(); // ajouter condition
    // check navbar.open state from store
    console.log(this.store);
    console.log(this.appStore);
    this.compiler.clearCache();
    this.store.subscribe(data => (this.globalStore = data));
    this.navbarState = this.globalStore.navbar.open;
    this.checkHeader(this.navbarState);



    // Check if the user is authenticated. If not, call the login() method
    if (!this.adal5Service.userInfo.authenticated) {
      this.adal5Service.login();
      console.log('adalDervicde login()');
    }

    // Log the user information to the console
    console.log('username ' + this.adal5Service.userInfo.username);
    console.log('authenticated: ' + this.adal5Service.userInfo.authenticated);
    console.log('name: ' + this.adal5Service.userInfo.profile.name);
    console.log('token: ' + this.adal5Service.userInfo.token);
    console.log(this.adal5Service.userInfo.profile);

    this.userName = this.adal5Service.userInfo.username;
    this.name = this.adal5Service.userInfo.profile.name;
    this.firstName = this.adal5Service.userInfo.profile.given_name;
    this.lastName = this.adal5Service.userInfo.profile.family_name;
    this.initials = `${this.firstName.slice(0, 1).toUpperCase()}${this.lastName.slice(0, 1).toUpperCase()}`;

    this.user = {
      name: this.name,
      userName: this.userName,
      initials: this.initials
    };

    this.appStore.dispatch({
      type: 'ADD_USER',
      payload: {
        user : {
          username: this.userName,
          name: this.name,
          initials: this.initials
        }
      }
    });
    console.log(this.appStore);
  }

  public logout(event) {
    if (event) {
      this.store.dispatch({
        type: 'DELETE_USER'
      });
      this.adal5Service.logOut();
    }
  }

  // get the event headerNav from root-header component
  checkHeaderNav(event) {
    this.headerNav = event;
    console.log(this.headerNav);
  }

  onClick() {
    this.store.subscribe(data => (this.globalStore = data));
    this.navbarState = this.globalStore.navbar.open;
    if (this.navbarState) {
      this.marginLeft = '235px';
    } else {
      this.marginLeft = '0px';
    }
  }

  onResize(event) {
    this.store.subscribe(data => (this.globalStore = data));
    this.navbarState = this.globalStore.navbar.open;
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


