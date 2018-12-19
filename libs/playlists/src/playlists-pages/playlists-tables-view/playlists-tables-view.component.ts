import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playlists-tables-view',
  templateUrl: './playlists-tables-view.component.html',
  styleUrls: ['./playlists-tables-view.component.scss']
})
export class PlaylistsTablesViewComponent implements OnInit {

  public daysTableView = 1;
  public headerTableLinkExist = true;
  public ErrorsTableLink = '../errors';
  public AllTableLink = '../all';
  public tableView = true;
  public changeView = true;
  public link =  '../';

  constructor() { }

  ngOnInit() {
  }

}
