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
  pushRightClass = 'push-right';
  isActive = false;
  showMenu = '';

// ADD
  public config: any;
  public headerFixedMargin: string;
  public isHeaderChecked: boolean;
  public sidebarFixedHeight: string;
  public pcodedHeaderPosition: string;


//

  constructor(
    private sanitizer: DomSanitizer,
    public menuItems: MenuItems
  ) { }

  ngOnInit() {
    this.headerFixedMargin = '56px';
    this.isHeaderChecked = true;
    this.sidebarFixedHeight = 'calc(100vh - 56px)';
    this.pcodedHeaderPosition = 'fixed';


  }

  sanitize(url: string) { // création d'une méthode permettant d'appeler les liens sans ajout de 'unsafe' avant l'adresse url
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }





// ADD
  setHeaderPosition() {
    this.isHeaderChecked = !this.isHeaderChecked;
    this.pcodedHeaderPosition = this.isHeaderChecked === true ? 'fixed' : 'relative';
    this.headerFixedMargin = this.isHeaderChecked === true ? '56px' : '';
  }

//
}
