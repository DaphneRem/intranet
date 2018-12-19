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

  public openNotification = false;

  public customNotification = {
    title: 'Attention',
    msg: 'La dernière playlist a été ajoutée il y a plus d’une heure',
    showClose: true,
    timeout: 10000,
    theme: 'default',
    type: 'warning',
    position: 'top-right',
    closeOther: true
  };
  constructor() { }

  ngOnInit() {
  }

}
