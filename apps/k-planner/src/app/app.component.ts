import { Component, OnInit, Compiler, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// import { Adal5HTTPService, Adal5Service } from 'adal-angular5';
import { AuthService } from './auth/auth.service';

import { Navbar, navbarInitialState, navbarReducer } from '@ab/root';

import { config } from './../../../../.privates-url';
import { AuthAdalService } from 'apps/fiches-materiel/src/app/auth-adal.service';
import { App } from 'apps/fiches-materiel/src/app/+state/app.interfaces';

import { Coordinateur } from '@ab/k-planner-lib/src/models/coordinateur';
import { CoordinateurService } from '@ab/k-planner-lib/src/services/coordinateur.service';
import { UtilisateurService } from '@ab/k-planner-lib/src/services/utilisateur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers : [
    CoordinateurService,
    UtilisateurService,
    Store,
    AuthService,
    // AuthAdalService
  ]
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private compiler: Compiler,
    private coordinateurService: CoordinateurService,
    private utilisateurService : UtilisateurService,
    private store: Store<Navbar>,
    private appStore: Store<App>,
    // private authAdalService: AuthAdalService,
    // private adal5Service: Adal5Service,
    private router: Router,
    private _zone: NgZone
  ) {
    this.navbarStoreOpen = this.store;
    // this.adal5Service.init(config);
  }

  private onDestroy$: Subject<any> = new Subject();

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
  public userName: string;
  public name: string;
  public user;
  public firstName: string;
  public lastName: string;
  public initials: string;
  public userNameSplit: string[];
  public shortUserName: string;
  public numGroup: number;
  public userIsReady = false;

  public currentCoordinateur: Coordinateur;

  ngOnInit() {
    if (!this.authService.authenticated) {
      console.log(this.authService.authenticated,"this.authService.authenticated")
      this.signIn();
    }
   console.log(this.authService,"this.authService")
    // console.log(this.adal5Service);
    // console.log(this.authAdalService);
    // console.log(this.adal5Service.userInfo);

    // Handle callback if this is a redirect from Azure
    // this.adal5Service.handleWindowCallback(); // ajouter condition
    // check navbar.open state from store

    console.log(this.store);
    console.log(this.appStore);

    this.compiler.clearCache();
    this.store.subscribe(data => (this.globalStore = data));
    this.navbarState = this.globalStore.navbar.open;
    this.checkHeader(this.navbarState);


    // Check if the user is authenticated. If not, call the login() method
    // if (!this.adal5Service.userInfo.authenticated) {
    //   this.adal5Service.login();
    //   console.log('adalDervicde login()');
    // }

    // Log the user information to the console

    // console.log('username ' + this.adal5Service.userInfo.username);
    // console.log('authenticated: ' + this.adal5Service.userInfo.authenticated);
    // console.log('name: ' + this.adal5Service.userInfo.profile.name);
    // console.log('token: ' + this.adal5Service.userInfo.token);
    // console.log(this.adal5Service.userInfo.profile);

    // this.userName = this.adal5Service.userInfo.username;
    // this.name = this.adal5Service.userInfo.profile.name;
    // this.firstName = this.adal5Service.userInfo.profile.given_name;
    // this.lastName = this.adal5Service.userInfo.profile.family_name;
    // this.initials = `${this.firstName.slice(0, 1).toUpperCase()}${this.lastName.slice(0, 1).toUpperCase()}`;

    // this.userNameSplit = this.userName.split('@');
    // this.shortUserName = this.userNameSplit[0];
    // console.log(this.shortUserName);
    // this.user = {
    //   name: this.name,
    //   userName: this.userName,
    //   initials: this.initials,
    //   shortUserName: this.shortUserName
    // };
    // console.log(this.appStore);
  }

  ngAfterViewInit() {
    console.log(this.authService);
    if (this.authService) {
        console.log(this.authService);
       
      if (this.authService.user !== null && this.authService.user !== undefined) {
         this.displayUser();
      } 
    }
   

  }

  ngOnDestroy() {
      this.onDestroy$.next();
      
  }

  // async signIn(): Promise<void> {
  //   await this.authService.signIn();
  //   console.log(this.authService);
  // }
  public myUser;
  signIn() {
      this.authService.signIn();
      console.log(this.authService);
      // this.addUser(this.authService.user);
      
  }

  displayUser() {
    console.log(this.authService);
  
    this.userName = this.authService.user["displayableId"]; // prenom.nom@mediawan.com
    this.name = this.authService.user['name']; // NOM Prénom
    console.log(this.userName,this.name  );
    let arrName = this.name.split(' ');
    this.firstName = arrName[1]; // Prénom
    this.lastName = arrName[0]; // Nom
    this.initials = `${this.firstName.slice(0, 1).toUpperCase()}${this.lastName.slice(0, 1).toUpperCase()}`;
    // this.shortUserName = this.authService.user['samaccountname'];
    // console.log(this.adal5Service);
    // console.log(this.authAdalService);
    // console.log(this.adal5Service.userInfo);

    // Handle callback if this is a redirect from Azure
    // this.adal5Service.handleWindowCallback(); // ajouter condition
    // check navbar.open state from store
    let email = encodeURIComponent(this.userName)
    this.getUtilisateurByLogin(email)
    console.log(this.store);
    console.log(this.appStore);
  
    // this.getAllCoordinateurs();


    
  }

  // getAllCoordinateurs() {
  //   this.coordinateurService.getAllCoordinateurs()
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe(data => {
  //         data.map(item => {
  //             if (item.Username === this.user.shortUserName) {
  //                 this.currentCoordinateur = item;
  //                 this.appStore.dispatch({
  //                   type: 'ADD_USER',
  //                   payload: {
  //                     user : {
  //                       username: this.userName,
  //                       name: this.name,
  //                       initials: this.initials,
  //                       shortUserName: this.shortUserName,
  //                       numGroup: this.currentCoordinateur.Groupe
  //                     }
  //                   }
  //                 });
  //               }
  //         });
  //   });
  // }


  getUtilisateurByLogin(email) {
      
    this.utilisateurService
    .getUtilisateurByLogin(email)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(data => {
        console.log(data , "Utilisateur  ");       
        this.shortUserName = data["UTI_USERNAME"]
        
        this.user = {
          name: this.name,
          userName: this.userName,
          initials: this.initials,
          shortUserName: data["UTI_USERNAME"]
        };
      
        this.appStore.dispatch({
          type: 'ADD_USER',
          payload: {
            user : {
              username: this.userName,
              name: this.name,
              initials: this.initials,
              shortUserName:  data["UTI_USERNAME"],
              numGroup: ''
            }
          }
        });
         
    this.userIsReady = true;
        console.log("appStore",this.appStore)
        console.log( this.shortUserName)
    });     

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


