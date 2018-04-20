import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playlists-all-details',
  templateUrl: './playlists-all-details.component.html',
  styleUrls: ['./playlists-all-details.component.scss']
})
export class PlaylistsAllDetailsComponent implements OnInit {
  public daysTableView = 3;
  public headerTableLinkExist = false;
  public goBack = true;

  constructor() { }

  ngOnInit() {
  }

}
