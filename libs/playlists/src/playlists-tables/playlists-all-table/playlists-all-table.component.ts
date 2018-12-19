import { Component, OnInit, Input } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { PlaylistsAllService } from '../../services/playlists-all.service';
import { Playlist } from '../../models/playlist';

@Component({
  selector: 'playlists-all-table',
  templateUrl: './playlists-all-table.component.html',
  styleUrls: ['./playlists-all-table.component.scss'],
  providers : [
    PlaylistsAllService
  ]
})
export class PlaylistsAllTableComponent implements OnInit {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;
  public comment: string;
  public dataReady = false;
  public showNotification = false;
  public lastAddition;
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
  public VLCustomDatatableOptions: CustomDatatablesOptions = {
    tableTitle: 'playlist vl',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme: 'blue theme',
    renderOption: true,
    dbClickActionExist: false,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'playlist',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme: 'blue theme',
    renderOption: true,
    dbClickActionExist: false,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };

  constructor(
    private playlistsErrorsService: PlaylistsAllService,
  ) {}

  ngOnInit() {
    this.getPlayListsAll(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    this.VLCustomDatatableOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
      this.VLCustomDatatableOptions.headerTableLink = this.headerTableLink;
    }
  }

  checkDaysViews() {
    if (this.daysTableView === 1) {
      this.customdatatablesOptions.paging = true;
      this.customdatatablesOptions.search = true;
      this.VLCustomDatatableOptions.paging = true;
      this.VLCustomDatatableOptions.search = true;
    } else {
      this.customdatatablesOptions.rowsMax = 15;
      this.VLCustomDatatableOptions.rowsMax = 15;
    }
  }

  checkDataReady() {
    return this.dataReady;
  }

  getPlayListsAll(number) {
    this.playlistsErrorsService
      .getPlaylistsAll(number)
      .subscribe(data => {
        this.lastAddition = data[0];
        this.checkLastAddition(this.lastAddition.dateordre);
        data.map(e => {
            let diff = new Date(e.datediff);
            let ordre = new Date(e.dateordre);
            e.datediff = diff.toLocaleString();
            e.dateordre = ordre.toLocaleString();
        });
        this.customdatatablesOptions.data = data;
        this.dataReady = true;
        this.customdatatablesOptions.data.map((e) => { if (e.typeplaylist === 'vl') { this.VLCustomDatatableOptions.data.push(e); }} );
        this.displayColumns(data);
      });
  }

  checkLastAddition(lastPlaylist) {
    let test = '2018-04-30T07:38:15';
    let lastPlaylistDate = new Date(lastPlaylist);
    let actualDate = new Date();
    let oneHour = 60 * 60 * 1000;
    let now = new Date(actualDate);
    if (now.getTime() - lastPlaylistDate.getTime() > oneHour) {
      this.showNotification = true;
    }
  }


  displayColumns(data) {
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'type',
        data : 'typeplaylist',
      },
      {
        title : 'chaîne',
        data : 'chaine'
      },
      {
        title : 'départ',
        data : 'depart',
      },
      {
        title : 'datediff',
        data : 'datediff'
      },
      {
        title : 'tstamp',
        data : 'dateordre',
      },
      {
        title : 'version',
        data : 'version'
      },
    ];
  this.VLCustomDatatableOptions.columns = this.customdatatablesOptions.columns;
  }

}




