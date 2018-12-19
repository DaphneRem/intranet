import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'go-back',
  templateUrl: './go-back.component.html',
  styleUrls: [
    './go-back.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class GoBackComponent implements OnInit {

  constructor(
    private location: Location
  ) {}

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
