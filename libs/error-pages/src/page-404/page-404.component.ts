import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-404',
  templateUrl: './page-404.component.html',
  styleUrls: ['./page-404.component.scss']
})
export class Page404Component implements OnInit {
  public error = '404';

  constructor() { }

  ngOnInit() {
  }

}
