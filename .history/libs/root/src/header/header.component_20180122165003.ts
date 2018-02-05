import { Component, OnInit, Input } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from '..//menu-items/menu-items';

@Component({
  selector: 'root-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle: string;

  constructor() { }

  ngOnInit() {
    console.log(this.headerTitle);
  }

}
