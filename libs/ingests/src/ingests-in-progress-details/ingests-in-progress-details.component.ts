import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-in-progress-details',
  templateUrl: './ingests-in-progress-details.component.html',
  styleUrls: ['./ingests-in-progress-details.component.scss']
})
export class IngestsInProgressDetailsComponent implements OnInit {
  public link = '/';
  public daysTableView = 1;
  public headerTableLinkExist = true;
  public headerTableLink = '../in-progress';
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
