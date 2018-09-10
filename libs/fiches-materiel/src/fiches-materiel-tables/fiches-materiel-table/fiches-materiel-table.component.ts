import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
export class FichesMaterielTableComponent implements OnInit, OnDestroy {
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public table;
  public ctrlKeyActive = false;
  public showModifBtn = false;
  public showModifAllEps = false;

  // activatedRoute parameters
  private sub: any;
  public columnParams;
  public orderParams;

  public today;
  public todayDate: Date;
  public todayTime: number;

  public selectedRows = [];
  public sortingData;
  public deadline;
  public livraison;
  public acceptation;
  public creation;
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
    responsive : true,
    defaultOrder: [],
    // importantData : [
    //   {
    //     index : 0,
    //     className: 'warning',
    //     cellData: []
    //   }
    // ],
    renderOption: true,
    dbClickActionExist: true,
    clickActionExist: true,
    multiSelection: true,
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.columnParams = +params['columnIndex'];
      this.orderParams = params['order'];
    });
    this.today = new Date().toJSON().slice(0, 19);
    this.todayDate = new Date(this.today);
    this.todayTime = this.todayDate.getTime();
    console.log(this.columnParams);
    console.log(this.orderParams);
    this.getFichesMateriel();
    this.checkLinks();
    this.displayAction();
  }

  checkDeadline(data, fm) { // check DeadLine && display important data
    if (fm.Deadline) {
      const fmDeadline = new Date(fm.Deadline);
      const fmTime = fmDeadline.getTime();
      if (this.todayTime > fmTime) {
        this.customdatatablesOptions.importantData[0].cellData.push(new Date(fm.Deadline).toLocaleString());
      }
    }
    if (data.indexOf(fm) === (data.length - 1)) {
      console.log(fm);
      console.log('terminée');
      this.dataReady = true;
    }
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      this.router.navigate([`/material-sheets/my-material-sheets/details/${dataRow.IdFicheMateriel}/${dataRow.IdFicheAchat}`]);
    };
    this.clickAction();
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
    console.log('display action ok');
  }

  clickAction() {
    this.customdatatablesOptions.clickAction = (dataRow, row) => {
      // permet d'afficher les bouton de modif
      let ctrlPress;
      this.showModifBtn = true;
      this.showModifAllEps = true;
      document.body.onclick = function (e) {
        if (e.ctrlKey) {
          alert('ctr key was pressed during the click');
          ctrlPress = true;
        } else {
          ctrlPress = false;
        }
      };

      let odd = $('tr.odd').hasClass('selected'); // si les deux sont faux c'est qu'aucun élément n'est encore sélectionné
      let even = $('tr.even').hasClass('selected');
      console.log(odd);
      console.log(even);

      let array = document.getElementsByTagName('tr');
      let select = document.getElementsByClassName('selected');

// todo => ajouter condition si ctrlPress true et ajouter autres touches de multiple sélection (shift...);

      console.log(select);
      console.log(array);
      // for (let i = 0; i < array.length; i++) {
      //   console.log(array[i]);
      //   console.log(array[i].className);
      //   if (array[i].classList.contains('.selected') || array[i].classList.contains('.selected')) {
      //     console.log(array[i]);
      //     console.log('oooooooooooooooooooo');
      //   } else {
      //     console.log('else');
      //   }
      // }
      console.log(this.selectedRows);
       if ( $(row).hasClass('selected') ) {
            $(row).removeClass('selected');
            console.log($(row));
            this.selectedRows.splice(this.selectedRows.indexOf(dataRow), 1);
      } else {
            $(row).removeClass('selected');
            $(row).addClass('selected');
            console.log($(row));
            this.selectedRows.push(dataRow);
      }
      console.log(this.selectedRows);


      // console.log(dataRow);
      // console.log(this.selectedRows.includes(dataRow));
      // console.log(this.selectedRows.length);
      // if (this.ctrlKeyActive) {
      //   console.log('ctrlActive');
      //   if (!this.selectedRows.includes(dataRow)) {
      //     this.selectedRows.push(dataRow);
      //     console.log('delete');
      //     console.log(this.selectedRows);
      //   } else {
      //    console.log(this.selectedRows);
      //   }
      // } else {
      //   console.log('! crtlActive');
      //   console.log(this.selectedRows.length);
      //   if (this.selectedRows.length === 0) {
      //     this.selectedRows.push(dataRow);
      //     console.log('! crtlActive + include');
      //     console.log(this.selectedRows);
      //   } else if (this.selectedRows.includes(dataRow)) {
      //     this.selectedRows = [];
      //     console.log('! crtlActive + include');
      //     console.log(this.selectedRows);
      //   } else {
      //     this.selectedRows = [];
      //     this.selectedRows.push(dataRow);
      //     console.log('! crtlActive + new');
      //     console.log(this.selectedRows);
      //   }
      // }
    };
  }

  showSelection() {
    console.log(this.selectedRows);
  }

  getFichesMateriel() {
    this.fichesMaterielService
      .getFichesMateriel()
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
          this.displayColumns();
          this.dataReady = true;
        } else {
          // data.map(e => {
          //   this.checkDeadline(data, e);
          // });
          this.customdatatablesOptions.data = data;
          this.customdatatablesOptions.defaultOrder = [[this.columnParams, this.orderParams]];
          this.displayColumns();
        }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  displayColumns() {
    this.customdatatablesOptions.columns = [
      {
        title : 'Deadline',
        data: 'Deadline'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.Deadline).toLocaleString();
        // }
      },
      {
        title : 'Suivi',
        data : function ( data, type, row, meta ) {
          return '<span class="label bg-info">' + 'En cours' + '</span>'; // change 'En cours' to real data
        }
      },
      {
        title : 'type fiche achat',
        data : 'NumEpisodeProd' // data manquante
      },
      {
        title : 'distributeur',
        data : 'NumEpisodeProd' // data manquante
      },
      {
        title : 'titre vf', // pour les tests
        data : 'TitreEpisodeVF' // pour les tests
      },
      {
        title : 'titre vo', // pour les tests
        data : 'TitreEpisodeVO' // pour les tests
      },
      {
        title : 'date création', // pour les tests
        data : 'DateCreation'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateCreation).toLocaleString();
        // }
      },
      {
        title : 'IdFicheAchat', // delete after tests ok
        data : 'IdFicheAchat'
      },
      {
        title : 'IdFicheMateriel', // delete after tests ok
        data : 'IdFicheMateriel'
      },
      {
        title : 'N° eps AB',
        data : 'NumEpisode',
      },
      {
        title : 'N° eps Prod',
        data : 'NumEpisodeProd',
      },
      {
        title : 'Date Livraison',
        data : 'DateLivraison'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateLivraison).toLocaleString();
        // }
      },
      {
        title : 'Version',
        data : 'Fiche_Mat_Version',
      },
      {
        title : 'Qualite',
        data : 'Fiche_Mat_Qualite',
      },
      {
        title : 'Date Acceptation',
        data : 'DateAcceptation'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateAcceptation).toLocaleString();
        // }
      },


    ];
    console.log('display columns ok');
    this.dataReady = true;

  }

}
