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
  public inProgressTableLink = '../in-progress';
  public completedTableLink = '../completed';
  public kaiTableLink = '../kai-waiting';
  public karinaTableLink = '../karina-waiting';
  constructor() { }

  ngOnInit() {
  }

}
