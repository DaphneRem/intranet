import { Component, OnInit, Input } from '@angular/core';
import { errorThemeColor } from '@ab/shared';

@Component({
  selector: 'widget-error',
  templateUrl: './widget-error.component.html',
  styleUrls: ['./widget-error.component.scss']
})
export class WidgetErrorComponent implements OnInit {
  @Input() error: string;
  public errorColor = errorThemeColor;

  constructor() { }

  ngOnInit() {
    console.log(this.errorColor);
  }

}
