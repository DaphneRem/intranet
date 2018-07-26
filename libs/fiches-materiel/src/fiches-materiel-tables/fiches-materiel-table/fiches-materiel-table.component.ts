import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

// fiches achat service & model import
import { FicheAchat } from '@ab/fiches-achat';
import { FicheAchatDetails } from '@ab/fiches-achat';
import { FichesAchatService } from '@ab/fiches-achat';

// fiches matériel service & model import
import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';


@Component({
  selector: 'fiches-materiel-table',
  templateUrl: './fiches-materiel-table.component.html',
  styleUrls: ['./fiches-materiel-table.component.scss'],
  providers : [
    FichesMaterielService,
    FichesAchatService
  ]
})
export class FichesMaterielTableComponent implements OnInit {
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;


  public deadline;
  public livraison;
  public acceptation;
  public dataReady = false;
  public render: boolean;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fiches Materiel',
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
    importantData : [
      {
        index : 0,
        className: 'warning',
        cellData: ['10/10/2018 à 00:00:00']
      }
    ],
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
    private fichesMaterielService: FichesMaterielService,
    private fichesAchatService: FichesAchatService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFichesMateriel();
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
      this.router.navigate([`/material-sheets/my-material-sheets`]);
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
  }

  checkDataReady() {
    return this.dataReady;
  }

  getFichesMateriel() {
    this.fichesMaterielService
      .getFichesMateriel()
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
            data.map(e => {
            this.deadline = new Date(e.Deadline);
            this.livraison = new Date(e.DateLivraison);
            this.acceptation = new Date(e.DateAcceptation);
            e.Deadline = this.deadline.toLocaleString();
            e.DateLivraison = this.livraison.toLocaleString();
            e.DateAcceptation = this.acceptation.toLocaleString();
            });
          this.customdatatablesOptions.data = data;
        }
        this.dataReady = true;
        this.displayColumns(data);
    });
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
    });
  }

  displayColumns(data) {
    this.customdatatablesOptions.columns = [
      {
        title : 'titre vf', // pour les tests
        data : 'TitreEpisodeVF' // pour les tests
      },
      {
        title : 'date création', // pour les tests
        data : 'DateCreation' // pour les tests
      },
      {
        title : 'Deadline',
        data : 'Deadline'
      },
      {
        title : 'N° eps Prod',
        data : 'NumEpisodeProd',
      },
      {
        title : 'N° eps AB',
        data : 'NumEpisode',
      },
      {
        title : 'Date Livraison',
        data : 'DateLivraison'
      },
      {
        title : 'Date Acceptation',
        data : 'DateAcceptation'
      },
      {
        title : 'Qualite',
        data : 'Fiche_Mat_Qualite'
      },
      {
        title : 'Version',
        data : 'Fiche_Mat_Version',
      },
    ];
  }

}
