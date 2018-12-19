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

}
