import { Component, OnInit, Input } from '@angular/core';
import * as themeColors from '@ab/shared';

@Component({
  selector: 'widget-data',
  templateUrl: './widget-data.component.html',
  styleUrls: [
    './widget-data.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})

export class WidgetDataComponent implements OnInit {
  @Input() data: any;
  @Input() error: boolean;
  @Input() errorMessage: string;

  public widgetsColors = {
    blue: themeColors.blueThemeColor,
    yellow: themeColors.yellowThemeColor,
    green: themeColors.greenThemeColor,
    red: themeColors.redThemeColor,
    grey: '#BDC3C7',
    valid: themeColors.validColor,
    invalid: themeColors.invalidColor,
    navbar: themeColors.customColorButton
  };

  constructor() {}

  ngOnInit() {
    this.displayWidetsColors();
    console.log(this.data);
    console.log(this.error);
    console.log(this.errorMessage);
  }
// add slice for comment
  displayWidetsColors() {
    if (this.data) {
      this.data.iconColor = this.widgetsColors[this.data.iconColor];
    } else {
      this.data.iconColor = '#ffff';
    }
    this.data.headerColor = this.widgetsColors[this.data.headerColor];
  }

}
