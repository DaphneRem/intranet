import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playlists-tables-view',
  templateUrl: './playlists-tables-view.component.html',
  styleUrls: ['./playlists-tables-view.component.scss']
})
export class PlaylistsTablesViewComponent implements OnInit {

  constructor() { }

  public tableView = true;
  public changeView = true;
  public link =  '../';
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

  ngOnInit() {
  }

}
