import { Component, OnInit, HostListener } from '@angular/core';
import { window } from 'rxjs/operators/window';

@Component({
  selector: 'scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: [
    './scroll-to-top.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class ScrollToTopComponent implements OnInit {
  public show = false;

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    (scrollY > 200) ? this.show = true : this.show = false;
  }

  constructor() { }

  ngOnInit() {
  }

  scrollToTop() {
     $('html, body').animate({ scrollTop: 0 }, 'slow');
     return false;
  }

}
