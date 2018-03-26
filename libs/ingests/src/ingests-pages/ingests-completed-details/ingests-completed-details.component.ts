import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-completed-details',
  templateUrl: './ingests-completed-details.component.html',
  styleUrls: ['./ingests-completed-details.component.scss']
})
export class IngestsCompletedDetailsComponent implements OnInit {
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
