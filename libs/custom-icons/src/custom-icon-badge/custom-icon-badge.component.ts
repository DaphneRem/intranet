import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'custom-icon-badge',
  templateUrl: './custom-icon-badge.component.html',
  styleUrls: [
    './custom-icon-badge.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CustomIconBadgeComponent implements OnInit {
  @Input() bigIcon;
  @Input() littleIcon;
  @Input() link;
  @Input() action;
  @Input() tooltip;
  @Input() tooltipMessage;

  public linkExist: boolean;
  public actionExist: boolean;

  constructor() {}

  ngOnInit() {
   this.checkLink(this.link);
   this.checkAction(this.action);
  }

  checkLink(link) { (link !== undefined) ? this.linkExist = true : this.linkExist = false; }
  checkAction(action) { (action !== undefined) ? this.actionExist = true : this.actionExist = false; }
}
