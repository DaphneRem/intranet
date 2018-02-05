import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; // permet de supprimer le 'unsafe' dans le href des liens distants
import { MenuItems } from '..//menu-items/menu-items';

@Component({
  selector: 'root-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [
    MenuItems
  ]
})
export class SidebarComponent implements OnInit {
  @Input() links: any[];
  @Input() title: string;
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

  

  constructor(
    private sanitizer: DomSanitizer,
    public menuItems: MenuItems
  ) { }

  ngOnInit() {
    console.log(this.pcodedHeaderPosition); // fixed : ok
  }

  sanitize(url: string) { // création d'une méthode permettant d'appeler les liens sans ajout de 'unsafe' avant l'adresse url
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onClickedOutsideSidebar(e: Event) {
    if ((this.windowWidth < 992 && this.toggleOn && this.verticalNavType !== 'offcanvas') || this.verticalEffect === 'overlay') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
    }
  }

}
