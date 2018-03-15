import { Component, OnInit, Input } from '@angular/core';
import { DatesDiffusionsService } from '../services/diffusions-dates.service';
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import swal from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { CustomDatatablesOptions } from '@ab/custom-datatables';


@Component({
  selector: 'diffusions-dates-table',
  templateUrl: './diffusions-dates-table.component.html',
  styleUrls: ['./diffusions-dates-table.component.scss'],
  providers: [
    CustomDatatablesOptions
  ]
})

export class DiffusionsDatesTableComponent implements OnInit {

  public render: boolean;
  public dtOptions: DataTables.Settings = {};
  public chanelsList: any = [];
  public chanelsSearchList: any = [];
  public datasForm: any = { channels: [], type: 'Grille' };
  public dropdownSettings = {};
  public nbrHours = '0';
  public myForm: FormGroup;
  public form: FormGroup;
  public currentQuery: any;
  public errorMessageNumProgram: string;
  public validProgramNumber: boolean;

  /*
  0 = initialisation
  1 = requette soumise
  2 = data chargée et ok
  3 = erreur de saisie formulaire
  */
  public dataloaded = 0;
  public formLoaded = false;

  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Dates de diffusions',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 20,
    lenghtMenu: [5, 10, 15],
    theme: 'blue theme',
    renderOption: false,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };

  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    width: '100%'
  };

  constructor(
    private diffService: DatesDiffusionsService,
    private formBuilder: FormBuilder
  ) {}

  // les modales de messages d'alertes.

  public modalMessage(title, message) {
    swal({
      title: title,
      text: message
    }).catch(swal.noop);
  }

  //  GESTION DE LA SELECTION DES DATES
  public onDateRangeChanged(event: IMyDateRangeModel) {
    const date1A: string =
      event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day;
    const date2A: string =
      event.beginDate.year +
      '-' +
      event.beginDate.month +
      '-' +
      event.beginDate.day;
    const date1 = new Date(date1A).getTime();
    const date2 = new Date(date2A).getTime();
    const time = date1 - date2; // msec
    const hoursDiff = time / (3600 * 1000);
    if (hoursDiff > 17520) {
      this.clearDateRange();
      this.modalMessage(
        '',
        'Vous ne pouvez pas définir une période suppérieure à 2 ans.'
      );
      this.clearDateRange();
    }
  }

  public setDateRange(): void {
    //  Set date range (today) using the patchValue function
    const date = new Date();
    this.myForm.patchValue({
      myDateRange: {
        beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  public clearDateRange() {
    //  Clear the date range using the patchValue function
    this.myForm.patchValue({ myDateRange: '' });
    // ici exceptionnellement je cible le bouton dans le dom qui est généré dynamiquement par le composant pour vider l'input de date
    setTimeout(function() {
      $('.btnclear').click();
    }, '1000');
  }
  //  TABLEAU RESULTATS DIFFS
  public searchSubmit(mode) {
    console.log('searchSubmit');
        // JSON d'exemple qui marche :
        if(mode === 'test'){
          this.datasForm= { "channels": [ { "id": 1, "itemName": "AB 1" }, { "id": 19, "itemName": "AB 3" } ], "type": "Conducteur", "programName": "2015-00953", "datesRange": { "date1": "2017-12-31T23:00:00.000Z", "date2": "2018-03-30T22:00:00.000Z" } };
       }
      const bodyString = JSON.stringify(this.datasForm).replace(/"/g, "'");
        this.currentQuery = this.diffService
          .getDiffusionsDates(this.datasForm)
          .subscribe(data => {
            // on vérifie si le résultat n'est pas VIDE
            const dataJson = JSON.stringify(data);
            if (data && data.length > 0
              && dataJson !== '{}'
              && dataJson !== '""'
              && dataJson !== '[]') {
              this.customdatatablesOptions.data = data;
              // calcul de la durée totale des éléments de la liste
              this.nbrHours = this.diffService.calculateTotalHours(data);
              this.dataloaded = 2;
            } else {
              this.modalMessage('', 'Aucuns résultats');
              this.dataloaded = 3;
            }
          });
  }

  // test formulaire recherche
  public formInputsTest() {
    let validator = false;
    if ( this.datasForm.type &&
          this.datasForm.channels.length > 0
        ) {
          if (this.datasForm.datesRange) {
            if (this.datasForm.datesRange.formatted) {
                this.datasForm.datesRange = {
                  date1: this.datasForm.datesRange.beginJsDate,
                  date2: this.datasForm.datesRange.endJsDate
                };
              }
              validator = true;
              this.searchSubmit('normal');
      } else {
        validator = false;
        console.log('ERROR 2');
        this.displayErrorMessage(validator);
      }
    } else {
      validator = false;
      console.log('ERROR 3');
      this.displayErrorMessage(validator);
    }
    //
  }

  public displayErrorMessage(state) {
    if (state === true) {
      this.dataloaded = 1;
     } else {
        this.modalMessage(
         '',
         'Il y\'a une erreur dans vos parametres de recherche'
        );
       this.dataloaded = 3;
     }
  }

  // validation de la saisie du numéro de programme
  // format : 2006-12345
  public numProgramValidator() {
    this.dataloaded = 1;
    this.validProgramNumber = false;
    const numProgram = this.datasForm.programName;
    if (numProgram === '' || numProgram === undefined ) {
      this.errorMessageNumProgram = 'Champ vide';
      this.validProgramNumber = false;
      this.displayErrorMessage(this.validProgramNumber);
    } else {
      if (numProgram.indexOf('-') === -1) {
        this.errorMessageNumProgram = 'Le numéro de programme doit contenir un tiret';
        this.validProgramNumber = false;
        this.displayErrorMessage(this.validProgramNumber);
      } else {
        const numPrognam_date = numProgram.split('-')[0];
        const numPrognam_id = numProgram.split('-')[1];
        console.log('numPrognam_date ' + numPrognam_date + ' numPrognam_id > ' + numPrognam_id);
        if (numPrognam_date < '1996') {
          this.errorMessageNumProgram = 'La date ne peut pas etre inférieur à 1996';
          this.validProgramNumber = false;
          this.displayErrorMessage(this.validProgramNumber);
        } else {
          this.diffService.checkProgramNumber(numProgram)
          .subscribe(data => {
            if (data === true) {
              this.validProgramNumber = true;
              this.formInputsTest();
            } else {
              this.errorMessageNumProgram = 'Le numéro de programme n\'existe pas ';
              this.displayErrorMessage(this.validProgramNumber);
            }
          });
        }
      }
    }
  }
  public selectProgName(progNumber) {
    this.datasForm.programName = progNumber;
    this.chanelsSearchList = [];
  }
  public onSearchChange(searchValue: any) {
    if (!isNaN(searchValue) || searchValue.indexOf('-') !== -1) {
      console.log('IS NUMBER ');
      this.chanelsSearchList = [];
    } else {
      console.log('IS NOT NUMBER ');
      if (searchValue.length > 5 ) {
        this.diffService.searchProgNumbersByName(searchValue).subscribe(data => { this.chanelsSearchList = data; });
      }

    }
  }

  public clearSearch() {
    this.datasForm = { channels: [], type: 'Grille' };
    this.dataloaded = 0;
    this.clearDateRange();
    this.nbrHours = '0';
    this.currentQuery.unsubscribe();
  }

  public searchFormInit() {
    this.formLoaded = false;
    // chargement de la liste des chaines dans l'input de selection
    this.diffService.getChanelsDiffusions().subscribe(data => {
      // créer un nouvel objet JSON au FORMAT compatible avec le module multi select installé
      const channels = data;
      const newList = [];
      for (let i = 0; i < channels.length; i++) {
        const newItem = { id: channels[i].code, itemName: channels[i].libelle };
        newList.push(newItem);
      }
      this.chanelsList = newList;
      this.dropdownSettings = {
        singleSelection: false,
        text: 'Selection de chaines',
        selectAllText: 'Tous selectionner',
        unSelectAllText: 'Désélectionner All',
        enableSearchFilter: false,
        classes: 'myclass custom-class'
      };
      this.formLoaded = true;
    });
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      myDateRange: ['', Validators.required]
    });
    this.searchFormInit();
    // this.diffService.searchProgNumbersByName('friends').subscribe(data => { this.chanelsSearchList = data;});
  }

  public clearnInputSearch() {
    this.datasForm.programName = '';
    this.dataloaded = 0;
  }

}
