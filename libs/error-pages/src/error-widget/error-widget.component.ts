import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'error-widget',
  templateUrl: './error-widget.component.html',
  styleUrls: [
    './error-widget.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    Location
  ]
})
export class ErrorWidgetComponent implements OnInit {
  @Input() error;

  constructor( private location: Location ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
