import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

// import { AuthAdalService } from './auth-adal.service';
// import { Adal5HTTPService, Adal5Service } from 'adal-angular5';
import { AuthService } from './auth/auth.service';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';
import { App, User } from './+state/app.interfaces';
import { appInitialState } from './+state/app.init';
import { config } from './../../../../.privates-url';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers : [
    Store,
    AuthService
    // AuthAdalService
  ]
})

export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private store: Store<Navbar>,
    private appStore: Store<App>,
    private authService: AuthService,
    // private authAdalService: AuthAdalService,
    // private adal5Service: Adal5Service,
  ) {
    this.navbarStoreOpen = this.store;
    // this.adal5Service.init(config);
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
  public userNameSplit;
  public shortUserName;
  public firstName: string;
  public lastName: string;
  public myUser;
  public userIsReady = false;

  ngOnInit() {
    // check navbar.open state from store
    if (!this.authService.authenticated) {
      this.signIn();
    }
    console.log(this.store);
    console.log(this.appStore);
    this.store.subscribe(data => (this.globalStore = data));
    this.navbarState = this.globalStore.navbar.open;
    this.checkHeader(this.navbarState);
  }

  ngAfterViewInit() {
    console.log(this.authService);
    if (this.authService) {
        console.log(this.authService);
      if (this.authService.user !== null && this.authService.user !== undefined) {
         this.displayUser();
      } else {
        setTimeout(() => {
           this.displayUser();
        }, 4000);
      }
    }
  }

  signIn() {
      this.authService.signIn();
      console.log(this.authService);
      // this.addUser(this.authService.user);
  }

    displayUser() {
    console.log(this.authService);
    console.log(this.authService.user);
    this.userName = this.authService.user.email; // prenom.nom@mediawan.com
    this.name = this.authService.user['displayName']; // NOM Prénom

    let arrName = this.name.split(' ');
    this.firstName = arrName[1]; // Prénom
    this.lastName = arrName[0]; // Nom
    this.shortUserName = this.authService.user['samaccountname'];
    // console.log(this.adal5Service);
    // console.log(this.authAdalService);
    // console.log(this.adal5Service.userInfo);

    // Handle callback if this is a redirect from Azure
    // this.adal5Service.handleWindowCallback(); // ajouter condition
    // check navbar.open state from store

    console.log(this.store);
    console.log(this.appStore);
    this.user = {
      name: this.name,
      userName: this.userName,
      shortUserName: this.shortUserName
    };
    this.appStore.dispatch({
        type: 'ADD_USER',
        payload: {
          user : {
            username: this.userName,
            name: this.name,
            shortUserName: this.shortUserName,
          }
        }
    });
    this.userIsReady = true;
    // this.getAllCoordinateurs();
  }
  logout(event) {
    if (event) {
      this.store.dispatch({
        type: 'DELETE_USER'
      });
      this.authService.signOut();
      // this.adal5Service.logOut();
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


