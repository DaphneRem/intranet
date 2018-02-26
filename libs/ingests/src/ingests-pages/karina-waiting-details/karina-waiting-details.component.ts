import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'karina-waiting-details',
  templateUrl: './karina-waiting-details.component.html',
  styleUrls: ['./karina-waiting-details.component.scss']
})
export class KarinaWaitingDetailsComponent implements OnInit {
  public link = '/';
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
