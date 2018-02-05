import { Component, OnInit, Input } from '@angular/core';

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
