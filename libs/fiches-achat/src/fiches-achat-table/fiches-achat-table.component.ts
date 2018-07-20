import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { FichesAchatService } from '../services/fiches-achat.service';
import { FicheAchat } from '../models/fiche-achat';

@Component({
  selector: 'fiches-achat-table',
  templateUrl: './fiches-achat-table.component.html',
  styleUrls: ['./fiches-achat-table.component.scss'],
  providers : [
    FichesAchatService
  ]
})
export class FichesAchatTableComponent implements OnInit,  OnChanges {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;
  @Input() currentView;
  // activeView =
  // 0 : all
  // 1 : traitées
  // 2 : non traitées

  public activeView = 2;
  public title = 'uuuu';
  public myFicheAchat: any = {};
  public render: boolean;
  public dataReady = false;
  public init = 0;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fiches Achat non traitées',
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
    reRenderOption: true,
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
    console.log(this.currentView);
    this.getFichesAchat(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
    this.displayAction();
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentView: SimpleChange = changes.currentView;
    console.log(this.currentView);
      this.getFichesAchat(this.currentView.id);
      this.checkDaysViews();
      this.checkLinks();
      this.displayAction();
      console.log(this.customdatatablesOptions);
      this.title = 'ok'
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  openMyModal() {
    document.querySelector('#recap-fiche-achat').classList.add('md-show');
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
      // document.querySelector('#recap-fiche-achat').classList.add('md-show');
      alert('OKOKOK');
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
          if (this.currentView.id === 2) {
            this.customdatatablesOptions.data = data;
          } else {
            this.customdatatablesOptions.data = [
                  {
                    'id_fiche': 13,
                    'numero_fiche': 'clone fiche',
                    'idad_lib_nom_ad': 0,
                    'nom_ad': '',
                    'vieux_fiche': false,
                    'code_storage': 0,
                    'nom_fichier': '',
                    'id_type_fiche': 5,
                    'libelle_type_fiche': 'Vidéo',
                    'commentaire': '',
                    'Nom_Gem': '',
                    'ResumeTitre': '',
                    'id_statut': 0,
                    'Date_Creation': '2018-09-01T17:43:15.507',
                    'Acheteur': 'AB-1206-010-W8 (BAUDON-H)',
                    'Producteur': '',
                    'Distributeur': null,
                    'User_Modif': '',
                    'Date_Modif': null,
                    'num_cessionnaire': null,
                    'chaines': null
                  },
                  {
                    'id_fiche': 56,
                    'numero_fiche': 'FA-2018-00021',
                    'idad_lib_nom_ad': 75859,
                    'nom_ad': 'IMAGISSIME',
                    'vieux_fiche': false,
                    'code_storage': 0,
                    'nom_fichier': '',
                    'id_type_fiche': 1,
                    'libelle_type_fiche': 'Chaîne',
                    'commentaire': 'sdfsdfsd',
                    'Nom_Gem': '',
                    'ResumeTitre': '',
                    'id_statut': 0,
                    'Date_Creation': '2018-02-05T14:50:43.55',
                    'Acheteur': '',
                    'Producteur': '',
                    'Distributeur': null,
                    'User_Modif': 'ZAIGOUCHE-A',
                    'Date_Modif': '2018-07-10T11:38:43.647',
                    'num_cessionnaire': null,
                    'chaines': null
                  }
          ];
          console.log(this.customdatatablesOptions.data);
          }
        }
        this.dataReady = true;
        this.displayColumns(data);
    });
  }

  displayColumns(data) {
    this.customdatatablesOptions.columns = [];
    Object.keys(data[0]).map((e) => this.customdatatablesOptions.columns.push(
      {
        title : e,
        data : e
      })
    );
  }

}




