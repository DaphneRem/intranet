import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

// service import
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchatDetails } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

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

  public render: boolean;

  public dataReady = false;
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
      },
      // {
      //   index : 2,
      //   className: 'blue',
      //   cellData: ['0']
      // }
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
            let deadline = new Date(e.Deadline);
            let livraison = new Date(e.DateLivraison);
            let acceptation = new Date(e.DateAcceptation);
            e.Deadline = deadline.toLocaleString();
            e.DateLivraison = livraison.toLocaleString();
            e.DateAcceptation = acceptation.toLocaleString();
          });
          data.map((item) => {

          })
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
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
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
      }
    ];
  }


}




  //   IdFicheMateriel: number;
  //   IdFicheAchat: number;
  //   IdFicheDetail: number;
  //  // Deadline: string;
  //   SuiviPar: string;
  //   IdLibstatut: number;
  //   IdLibEtape: number;
  //   // NumEpisodeProd: number;
  //   NumEpisodeAB: number;
  //   TitreEpisodeVF: string;
  //   TitreEpisodeVO: string;
  //   IdSupport: string;
  //   NumProgram: string;
  //   // NumEpisode: number;
  //   ReceptionAccesLabo: string;
  //   NomLabo: string;
  //   CoutLabo: number;
  //   // DateLivraison: string;
  //   DelaiLivraison: number;
  //   UniteDelaiLivraison: number;
  //   // DateAcceptation: string;
  //   DatePremiereDiff: string;
  //   AccesVF: string;
  //   Commentaires: string;
  //   RetourOri: number;
  //   RetourOriDernierDelai: string;
  //   IdStatutElementsAnnexes: number;
  //   UserCreation: string;
  //   UserModification: string;
  //   DateCreation: string;
  //   DateModification: string;
  //   Fiche_Mat_ElementsAnnexes: any;
  //   Fiche_Mat_LibEtape: null;
  //   Fiche_Mat_LibRetourOri: null;
  //   Fiche_Mat_Libstatut: null;
  //   Fiche_Mat_LibStatutElementsAnnexes: null;
  //   Fiche_Mat_HistoriqueDateLivraison: any;
  //   Fiche_Mat_HistoriqueStatutEtape: any;
  //   // Fiche_Mat_Qualite: any;
  //   Fiche_Mat_StatutElementsAnnexes: any;
  //   // Fiche_Mat_Version: any;
