import { Component, OnInit } from '@angular/core';
// import { Globals } from '../components-lib/globals';


@Component({
  selector: 'app-init',
  templateUrl: './app1.component.html',
  styleUrls: ['./app1.component.scss'],
  // providers: [Globals]

})

export class App1Component implements OnInit {

  constructor(
    // private globals: Globals
  ) { }

  title = 'App 1';
  // links = this.globals.links;
  // wHeight: number = window.innerHeight;

  ngOnInit() {
    console.log(window.innerHeight);
  }

  // onResize(event) {
  //   console.log(event.target.innerHeight);
  //   this.wHeight = event.target.innerHeight;
  // }

}
