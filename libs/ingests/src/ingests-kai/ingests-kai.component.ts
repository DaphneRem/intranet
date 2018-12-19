import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-kai',
  templateUrl: './ingests-kai.component.html',
  styleUrls: ['./ingests-kai.component.scss']
})
export class IngestsKaiComponent implements OnInit {
  public link = '/';
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
