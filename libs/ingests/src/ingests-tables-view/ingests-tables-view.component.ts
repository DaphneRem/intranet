import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-tables-view',
  templateUrl: './ingests-tables-view.component.html',
  styleUrls: ['./ingests-tables-view.component.scss']
})
export class IngestsTablesViewComponent implements OnInit {
  public link = '/';
  public daysTableView = 1;
  public headerTableLinkExist = true;
  public headerTableLink = '../in-progress';

  constructor() { }

  ngOnInit() {
  }

}
