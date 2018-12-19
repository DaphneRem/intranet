import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'change-view',
  templateUrl: './change-view.component.html',
  styleUrls: [
    './change-view.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class ChangeViewComponent implements OnInit {
  @Input() link;
  @Input() tableView;

  constructor() {
  }

  ngOnInit() {
  }

}
