import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-in-progress-details',
  templateUrl: './ingests-in-progress-details.component.html',
  styleUrls: ['./ingests-in-progress-details.component.scss']
})
export class IngestsInProgressDetailsComponent implements OnInit {
  public link = '/';
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
