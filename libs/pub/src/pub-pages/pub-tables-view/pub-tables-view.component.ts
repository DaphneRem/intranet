import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pub-tables-view',
  templateUrl: './pub-tables-view.component.html',
  styleUrls: ['./pub-tables-view.component.scss']
})
export class PubTablesViewComponent implements OnInit {
  public link = '../';
  // public daysTableView = 1;
  public view24h = 1;
  public view72h = 3;
  // public headerTableLinkExist = true;
  // public inProgressTableLink = '../in-progress';
  public completedTableLink = './completed';

  constructor() { }

  ngOnInit() {
  }

}