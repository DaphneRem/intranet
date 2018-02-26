import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'widget-data',
  templateUrl: './widget-data.component.html',
  styleUrls: ['./widget-data.component.scss']
})
export class WidgetDataComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
