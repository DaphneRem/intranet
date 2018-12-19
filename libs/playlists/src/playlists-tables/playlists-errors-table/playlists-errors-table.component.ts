import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { PlaylistsErrorsService } from '../../services/playlists-errors.service';
import { Playlist } from '../../models/playlist';

@Component({
  selector: 'playlists-errors-table',
  templateUrl: './playlists-errors-table.component.html',
  styleUrls: ['./playlists-errors-table.component.scss'],
  providers : [
    PlaylistsErrorsService
  ]
})
export class PlaylistsErrorsTableComponent implements OnInit {
  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;
  public comment = {
    exist : false,
    title : 'Message d\'erreur',
    text : ''
  };
  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'erreurs',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme: 'error theme',
    renderOption: true,
    dbClickActionExist: true,
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
    private playlistsErrorsService: PlaylistsErrorsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPlayListsErrors(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
    this.displayAction();
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      console.log(dataRow);
      this.comment.exist = true;
      this.comment.text = dataRow.commentaire;
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour voir le message d\'erreur associé';
  }

  checkDaysViews() {
    if (this.daysTableView === 1) {
      this.customdatatablesOptions.paging = true;
      this.customdatatablesOptions.search = true;
    } else {
      this.customdatatablesOptions.rowsMax = 15;
    }
  }

  checkDataReady() {
    return this.dataReady;
  }

  getPlayListsErrors(number) {
    this.playlistsErrorsService
      .getPlaylistsErrors(number)
      .subscribe(data => {
        data.map(e => {
            let diff = new Date(e.datediff);
            let ordre = new Date(e.dateordre);
            e.datediff = diff.toLocaleString();
            e.dateordre = ordre.toLocaleString();
        });
        this.customdatatablesOptions.data = data;
        this.dataReady = true;
        this.displayColumns(data);
      });
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
  }

}




