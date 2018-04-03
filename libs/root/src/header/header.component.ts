import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { MenuItems } from '../menu-items/menu-items.service';
import { Navbar } from '../+state/navbar.interfaces';
import { navbarInitialState } from '../+state/navbar.init';

import {rootUrl} from '../../../../.privates-url';


@Component({
  selector: 'root-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MenuItems, Store],
  animations: [
    trigger('notificationBottom', [
      state(
        'an-off, void',
        style({
          overflow: 'hidden',
          height: '0px'
        })
      ),
      state(
        'an-animate',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE
        })
      ),
      transition('an-off <=> an-animate', [animate('400ms ease-in-out')])
    ]),
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '300px'
          // transform: 'translate3d(0, 0, 0)'
        })
      ),
      state(
        'out',
        style({
          width: '0'
          // transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('mobileHeaderNavRight', [
      state(
        'nav-off, void',
        style({
          overflow: 'hidden',
          height: '0px'
        })
      ),
      state(
        'nav-on',
        style({
          height: AUTO_STYLE
        })
      ),
      transition('nav-off <=> nav-on', [animate('400ms ease-in-out')])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle: string;
  @Input() logo: string;

  @Output() headerNav: EventEmitter<boolean> = new EventEmitter<boolean>();

  // attr généraux
  public navType: string;
  public themeLayout: string;
  public verticalPlacement: string;
  public verticalLayout: string;
  public pcodedDeviceType: string;
  public vnavigationView: string;
  public freamType: string;
  public layoutType: string;
  public rootUrl = rootUrl;

  // header thème non utilisé ici pour le moment
  public headerTheme: string;

  // notifications (bell)
  public liveNotification: string;
  public liveNotificationClass: string;

  // notifications (profil)
  public profileNotification: string;
  public profileNotificationClass: string;

  // input search
  public searchWidth: number;
  public searchWidthString: string;

  // header responsive
  public navRight: string;
  public chatTopPosition: string;

  /******** Options navBar : *********/

  public headerFixedMargin: string;
  public windowWidth: number;
  public toggleOn: boolean;
  public verticalNavType: string;
  public verticalEffect: string;
  public isHeaderChecked: boolean;
  public sidebarFixedHeight: string;
  public pcodedHeaderPosition: string;
  public pcodedSidebarPosition: string;

  // Navbar theme

  public navBarTheme: string;
  public activeItemTheme: string;
  public itemBorderStyle: string;
  public subItemBorder: boolean;
  public itemBorder: boolean;
  public dropDownIcon: string;
  public subItemIcon: string;

  /**********************************/

  navbarState: any;

  constructor(public menuItems: MenuItems, private store: Store<Navbar>) {
    this.navType = 'st1'; // icon menu have colors. Change to 'st2' for no colors
    this.themeLayout = 'vertical';
    this.verticalPlacement = 'left';
    this.verticalLayout = 'wide';
    this.pcodedDeviceType = 'desktop';
    this.verticalNavType = 'expanded';
    this.verticalEffect = 'shrink';
    this.vnavigationView = 'view1';
    this.freamType = 'theme1';
    this.layoutType = 'light';
    this.headerTheme = 'themelight5';
    this.pcodedHeaderPosition = 'fixed';
    this.liveNotification = 'an-off';
    this.profileNotification = 'an-off';
    this.searchWidth = 0;
    this.navRight = 'nav-on';
    this.windowWidth = window.innerWidth;
    this.toggleOn = true;
    this.navBarTheme = 'theme1';
    this.activeItemTheme = 'theme12';
    this.pcodedSidebarPosition = 'fixed';
    this.dropDownIcon = 'style1';
    this.subItemIcon = 'style7';
    this.isHeaderChecked = true;
    this.headerFixedMargin = '56px';
    this.sidebarFixedHeight = 'calc(100vh - 56px)';
    this.itemBorderStyle = 'none';
    this.subItemBorder = true;
    this.itemBorder = true;

    this.setMenuAttributes(this.windowWidth);
  }

  ngOnInit() {
    this.setBackgroundPattern('pattern1');
    this.setNavbar();
    if (innerWidth <= 992) {
      this.headerNav.emit(true);
    }
  }

  /******** Responsive management *******/

  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (
      this.pcodedDeviceType === 'tablet' &&
      this.windowWidth >= 768 &&
      this.windowWidth <= 1024
    ) {
      reSizeFlag = false;
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    } else if (this.pcodedDeviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setNavbar() {
    this.windowWidth = innerWidth;
    if (this.windowWidth >= 768 && this.windowWidth <= 1024) {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    } else if (this.windowWidth < 768) {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    } else {
      this.store.dispatch({ type: 'OPEN_NAVBAR' });
    }
  }

  setMenuAttributes(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.pcodedDeviceType = 'tablet';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    } else if (windowWidth < 768) {
      this.pcodedDeviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    } else {
      this.pcodedDeviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
      this.store.dispatch({ type: 'OPEN_NAVBAR' });
    }
  }

  /********* Responsive Header *********/

  toggleHeaderNavRight() {
    this.navRight = this.navRight === 'nav-on' ? 'nav-off' : 'nav-on';
    this.headerNav.emit(this.navRight === 'nav-on' ? true : false);
    this.chatTopPosition = this.chatTopPosition === 'nav-on' ? '112px' : '';
  }

  /************ Notifications ***********/

  // Live Notifications (bell)
  toggleLiveNotification() {
    this.liveNotification =
      this.liveNotification === 'an-off' ? 'an-animate' : 'an-off';
    this.liveNotificationClass =
      this.liveNotification === 'an-animate' ? 'active' : '';
  }

  // Profil
  toggleProfileNotification() {
    this.profileNotification =
      this.profileNotification === 'an-off' ? 'an-animate' : 'an-off';
    this.profileNotificationClass =
      this.profileNotification === 'an-animate' ? 'active' : '';
  }

  // Click Outside : close notifications
  notificationOutsideClick(ele: string) {
    if (ele === 'live' && this.liveNotification === 'an-animate') {
      this.toggleLiveNotification();
    } else if (ele === 'profile' && this.profileNotification === 'an-animate') {
      this.toggleProfileNotification();
    }
  }

  /************** Search Input ************/

  searchOn() {
    document.querySelector('#main-search').classList.add('open');
    const searchInterval = setInterval(() => {
      if (this.searchWidth >= 200) {
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth + 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  searchOff() {
    const searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector('#main-search').classList.remove('open');
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth - 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  /************ Navbar Management ************/

  toggleOpened() {
    if (this.windowWidth < 992) {
      this.toggleOn =
        this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
      if (this.navRight === 'nav-on') {
        this.toggleHeaderNavRight();
      }
    }
    this.verticalNavType =
      this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
    if (this.verticalNavType === 'expanded') {
      this.store.dispatch({ type: 'OPEN_NAVBAR' });
    } else {
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    }
  }

  onClickedOutsideSidebar(e: Event) {
    if (
      (this.windowWidth < 992 &&
        this.toggleOn &&
        this.verticalNavType !== 'offcanvas') ||
      this.verticalEffect === 'overlay'
    ) {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
      this.store.dispatch({ type: 'CLOSE_NAVBAR' });
    }
  }

  /************ Background Pattern ************/

  setBackgroundPattern(pattern: string) {
    document.querySelector('body').setAttribute('themebg-pattern', pattern);
  }
}
