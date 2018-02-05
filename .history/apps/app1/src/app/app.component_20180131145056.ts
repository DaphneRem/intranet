import { Component, OnInit } from '@angular/core';
// import { Globals } from '../../../../libs/globals';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [Globals]

})

export class AppComponent implements OnInit {

  constructor(
    // private globals: Globals
  ) { }

  title = 'app1';
  links = this.globals.links;
  // wHeight: number = window.innerHeight;

  ngOnInit() {
    console.log(window.innerHeight);
  }

  // onResize(event) {
  //   console.log(event.target.innerHeight);
  //   this.wHeight = event.target.innerHeight;
  // }

}
