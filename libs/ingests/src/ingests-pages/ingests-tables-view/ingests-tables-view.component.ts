import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-tables-view',
  templateUrl: './ingests-tables-view.component.html',
  styleUrls: ['./ingests-tables-view.component.scss']
})
export class IngestsTablesViewComponent implements OnInit {
  public link = '/';
  public view24h = 1;
  public view72h = 3;
  public completedTableLink = './completed';
  // public inProgressTableLink = '../in-progress';
  // public kaiTableLink = '../kai-waiting';
  // public karinaTableLink = '../karina-waiting';

  constructor() { }

  ngOnInit() {
  }

}
