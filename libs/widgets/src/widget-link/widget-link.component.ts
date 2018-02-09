import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'widget-link',
  templateUrl: './widget-link.component.html',
  styleUrls: [
    './widget-link.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class WidgetLinkComponent implements OnInit {
  @Input() widgetTitle;
  @Input() widgetSubTitle;
  @Input() widgetIcon;
  @Input() widgetLink;
  @Input() widgetBackgroundColor;

  constructor() { }

  ngOnInit() {
    console.log(this.widgetLink);
  }

}
