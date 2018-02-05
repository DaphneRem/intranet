import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; // permet de supprimer le 'unsafe' dans le href des liens distants
import { MenuItems } from '..//menu-items/menu-items';

@Component({
  selector: 'root-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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


  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.headerFixedMargin = '56px';
    this.isHeaderChecked = true;

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
}
