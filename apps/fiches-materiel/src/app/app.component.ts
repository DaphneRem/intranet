import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/****** Version import ******/
// const version: string = require('../../../../package.json').version; // FROM PACKAGE.JSON
import { environment } from '../environments/environment'; // FROM ENVIRONEMENT

// import { AuthAdalService } from './auth-adal.service';
// import { Adal5HTTPService, Adal5Service } from 'adal-angular5';
import { AuthService } from './auth/auth.service';

import { UserMediawanService } from './auth/user-mediawan.service';
import { UserMediawan } from './auth/user-mediawan';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';
import { App, User } from './+state/app.interfaces';
import { appInitialState } from './+state/app.init';
import { config } from './../../../../.privates-url';

// export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers : [
    Store,
    AuthService,
    UserMediawanService
    // AuthAdalService
  ]
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

subscription: Subscription;

  constructor(
    private store: Store<Navbar>,
    private appStore: Store<App>,
    private authService: AuthService,
    private router: Router,
    private userMediawanService: UserMediawanService
    // private authAdalService: AuthAdalService,
    // private adal5Service: Adal5Service,
  ) {
    this.navbarStoreOpen = this.store;
    this.displayVersionApp();
    // this.subscription = router.events.subscribe(event => {
    //   console.log(event);
    //   if (event instanceof NavigationStart) {
    //     browserRefresh = !router.navigated;
    //   }
    // });
    // this.adal5Service.init(config);
  }

  public versionApp: string;
  public userMediawan: UserMediawan;
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
  public emailUser: string;

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
      if (this.authService.userMSAL !== null && this.authService.userMSAL !== undefined) {
        //  this.displayUser();
        this.emailUser = this.authService.userMSAL.displayableId;
        console.log('this.emailUser => ', this.emailUser);
        this.getUserMediawan(this.emailUser);
      } else {
        console.log('Error whit this.authService.userMSAL => ', this.authService.userMSAL);
        // setTimeout(() => {
        //   this.displayUser();
        //   this.getUserMediawan(this.emailUser);

        // }, 10000);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  displayVersionApp() {
    this.versionApp = environment.version;
  }

  getUserMediawan(user) {
    // user = user.replace('@', '%40');
    this.userMediawanService
      .getUserMediawan(user)
      .subscribe(data => {
        this.userMediawan = data;
        console.log('userMediawan => ', data);
        this.displayUser();
      });
  }

  signIn() {
      this.authService.signIn();
      console.log('signIn() : authService => ', this.authService);
      // this.addUser(this.authService.user);
  }

  displayUser() {
    console.log(this.authService);
    console.log(this.authService.userMSAL);
    this.userName = this.emailUser;
    this.name = this.authService.userMSAL.name; // NOM Prénom
    this.shortUserName = this.userMediawan.UTI_USERNAME;
    console.log(this.store);
    console.log(this.appStore);
    this.user = {
      name: this.name, // REMALI Daphne
      userName: this.userName, // prenom.nom@mediawan.com
      shortUserName: this.shortUserName // REMALI-D
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


