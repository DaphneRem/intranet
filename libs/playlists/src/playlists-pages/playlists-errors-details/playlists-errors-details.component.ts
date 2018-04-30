import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playlists-errors-details',
  templateUrl: './playlists-errors-details.component.html',
  styleUrls: ['./playlists-errors-details.component.scss']
})
export class PlaylistsErrorsDetailsComponent implements OnInit {
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  public openNotification = false;
  constructor() {}

  ngOnInit() {}
}
