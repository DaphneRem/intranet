import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pub-in-progress-details',
  templateUrl: './pub-in-progress-details.component.html',
  styleUrls: ['./pub-in-progress-details.component.scss']
})
export class PubInProgressDetailsComponent implements OnInit {
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
