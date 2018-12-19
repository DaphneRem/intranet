import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playlists-widgets-view',
  templateUrl: './playlists-widgets-view.component.html',
  styleUrls: ['./playlists-widgets-view.component.scss']
})
export class PlaylistsWidgetsViewComponent implements OnInit {

  constructor() { }
  public tableView = false;
  public changeView = true;
  public link = './tables-view';
  public widgets: any = [
    {
      title: 'Erreurs Playlist',
      icon: 'icofont icofont-warning-alt',
      size: 'col-md-12 col-lg-6 ',
      link: './errors',
      color: '#FF0000'
    },
    {
      title: 'Toutes les Playlists',
      icon: 'icofont icofont-youtube-play',
      size: 'col-md-12 col-lg-6 ',
      link: './all',
      color: '#39ADB5'
    },
  ];

  ngOnInit() {
  }

}
