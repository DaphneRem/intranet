import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pub-completed-details',
  templateUrl: './pub-completed-details.component.html',
  styleUrls: ['./pub-completed-details.component.scss']
})
export class PubCompletedDetailsComponent implements OnInit {
  public link = '/';
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
