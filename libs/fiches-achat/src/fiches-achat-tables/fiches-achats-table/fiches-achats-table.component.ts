import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

// service import
import { FichesAchatService } from '../../services/fiches-achat.service';
import { FicheAchat } from '../../models/fiche-achat';

@Component({
  selector: 'fiches-achats-table',
  templateUrl: './fiches-achats-table.component.html',
  styleUrls: ['./fiches-achats-table.component.scss'],
    providers : [
    FichesAchatService
  ]
})
export class FichesAchatsTableComponent implements OnInit {
  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public myFicheAchat: any = {};
  public render: boolean;
  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fiches Achat',
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
    // importantData : [
    //   {
    //     index : 4,
    //     className: 'warning',
    //     cellData: ['Storage OK']
    //   },
    //   {
    //     index : 2,
    //     className: 'blue',
    //     cellData: ['0']
    //   }
    // ],
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
    private fichesAchatService: FichesAchatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFichesAchat(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
    this.displayAction();
  }

  // openMyModal() {
  //   document.querySelector('#' + event).classList.add('md-show');
  //   console.log(event);
  // }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  openMyModal() {
    console.log(document.querySelector('#recap-fiche-achat'));
    document.querySelector('#recap-fiche-achat').classList.add('md-show');
    document.getElementById('recap-fiche-achat').classList.add('md-show');
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
      document.querySelector('#recap-fiche-achat').classList.add('md-show');
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
  }

  selectedFicheAchat(event) {
    console.log(event);
    this.myFicheAchat = event;
    console.log(this.myFicheAchat);
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

  getFichesAchat(number) {
    this.fichesAchatService
      .getFichesAchat(number)
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
          this.customdatatablesOptions.data = data;
        }
        this.dataReady = true;
        this.displayColumns(data);
    });
  }

  displayColumns(data) {
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'titreSeg',
        data : 'titreSeg',
        className: 'long-data'
      },
      {
        title : 'id',
        data : 'id',
      },
      {
        title : 'noseg',
        data : 'noseg',
      },
      {
        title : 'nomfichier',
        data : 'nomfichier',
      },
      {
        title : 'stockage',
        data : 'stockage'
      },
      {
        title : 'idSuivant',
        data : 'idSuppSuivant',
        className: 'long-data'
      },
      // {
      //   title : 'noSegSuivant',
      //   data : 'noSegSuivant'
      // },
      // {
      //   title : 'statut',
      //   data : 'statutSupport',
      // },
      {
        title : 'diffusion ID',
        data : 'diffusionid'
      },
      {
        title : 'type',
        data : 'typeSupport',
      },
      {
        title : 'date état',
        data : 'tstamp',
      },
      {
        title : 'commentaires',
        data : 'commentaires',
        className: 'long-data'
      },
    ];
  }

}




