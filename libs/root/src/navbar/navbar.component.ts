import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; // allows to remove the 'unsafe' in the remote links href

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Navbar } from '../+state/navbar.interfaces';
import { navbarInitialState } from '../+state/navbar.init';

import { MenuItems } from '../menu-items/menu-items.service';

@Component({
  selector: 'root-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    MenuItems,
    Store
  ]
})
export class NavbarComponent implements OnInit {

  @Input() headerFixedMargin: string;
  @Input() windowWidth: number;
  @Input() toggleOn: boolean;
  @Input() verticalNavType: string;
  @Input() verticalEffect: string;
  @Input() isHeaderChecked: string;
  @Input() sidebarFixedHeight: string;
  @Input() pcodedHeaderPosition: string;
  @Input() pcodedSidebarPosition: string;
  // Navbar theme
  @Input() navBarTheme: string;
  @Input() activeItemTheme: string;
  @Input() itemBorder: string;
  @Input() itemBorderStyle: string;
  @Input() subItemBorder: string;
  @Input() dropDownIcon: string;
  @Input() subItemIcon: string;

  @Input() userSpecifiRights?: any;
  @Input() specificRightsExist?: boolean;

  public config: any;
  public localMode: boolean;
  constructor(
    private sanitizer: DomSanitizer,
    public menuItems: MenuItems,
    private store: Store<Navbar>

  ) { }

  ngOnInit() {
    this.isLocalMode();
  }
  isLocalMode() {
    if (document.location.href.indexOf('localhost') !== -1) {
      this.localMode = true;
    } else {
      this.localMode = false;
    }
  }

  linkActiveTest(url) {
    const currentPath = document.location.href;
    if (currentPath.indexOf(url) !== -1 ) {
      return 'active';
    }
  }
  // method to call the links without adding 'unsafe' before the url address
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  displayItemIfSpecificRights(item) {
    // console.log('item navbar =>', item);
    // console.log('users rights => ', this.userSpecifiRights);
    if (item.hasOwnProperty('needSpecificRights')) { // check if need rights to display route
      if (this.specificRightsExist && item.needSpecificRights.length > 0) { // check if user rights are specified in app
        if (this.userSpecifiRights.length > 0 ) { // check if user has rights for display route
          let rights = [];
          for (let i = 0; i < item.needSpecificRights.length; i++) {
            for (let j = 0; j < this.userSpecifiRights.length; j++) {
              if (item.needSpecificRights[i].toLowerCase() === this.userSpecifiRights[j].toLowerCase()) {
                rights.push(item.needSpecificRights[i]);
            }
          }
        }
        console.log('rights => ', rights);
        if (rights.length === item.needSpecificRights.length) {
          console.log('true');
          return true;
        } else {
          console.log('false');
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
}

}
