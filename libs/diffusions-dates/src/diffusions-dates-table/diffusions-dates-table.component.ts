import { Component, OnInit } from '@angular/core';
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

  public chanelsList: any = []; // liste des chaines formulaire de recherche
  public chanelsSearchList: any = []; // liste résultat recherche programme par nom
  public datasForm: any = { channels: [], type: 'Grille' }; // objet envoyé par le formulaire pour recherche
  public dropdownSettings = {};
  public totalNbrHours = '0';
  public myForm: FormGroup; // objet formulaire utilisé pour le selecteur de dates

  public currentQuery: any; // variable utilisée pour lancer la requette de recherche et pour pouvoir la tuer quand on annule
  public errorMessageNumProgram: string; // variable contenant les différents messages d'erreur
  public validProgramNumber = false; // variable pour valider les différentes étapes de vérification des champs de formulaire

  // dataloaded >>
  // 0 = initialisation
  // 1 = requette soumise
  // 2 = data chargée et ok
  // 3 = erreur de saisie formulaire

  public dataloaded = 0;
  public formLoaded = false;


  constructor(
    private diffService: DatesDiffusionsService,
    private formBuilder: FormBuilder
  ) {}


  // initialisation des parametres du composant taleau
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
  // initialisation des parametre du selecteur de dates
  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    width: '100%'
  };

  // fonction d'appel des modales de messages d'alertes.
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
    // ajout de la condition pour limitée la periode séléctionnée à 2 ans;
    if (hoursDiff > 17520) {
      // si > à 2 ans on affiche un message et on vide la zone de saisie de dates;
      this.clearDateRange();
      this.modalMessage(
        '',
        'Vous ne pouvez pas définir une période suppérieure à 2 ans.'
      );
      this.clearDateRange();
    }
  }

  // récupération des dates choisies
  public setDateRange(): void {
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

  // supprimer contenu saisie dans le selecteur de dates
  public clearDateRange() {
    this.myForm.patchValue({ myDateRange: '' });
    // ici exceptionnellement je cible le bouton dans le dom qui est généré dynamiquement par le composant pour vider l'input de date
    setTimeout(function() {
      $('.btnclear').click();
    }, '1000');
  }

  public searchValidator() {

      // regroupement des différentes étapes de validation du formulaire;

      this.validProgramNumber = this.numProgramValidator();

      if (this.validProgramNumber === true) {

          this.diffService.checkProgramNumber(this.datasForm.programName)
          .subscribe(data => {// on test le numéro de programme saisie dans la BDD.
            this.validProgramNumber = data;
            if (data === false) {

                this.errorMessageNumProgram = 'Le numéro de programme n\'existe pas ';
                this.dataloaded = 3;
                this.modalMessage(
                  '',
                  this.errorMessageNumProgram
                  );
              } else {

              // si le numéro de programme est validé on enchaine sur les autres vérifications de formulaire
              const validationForm = this.formInputsTest();
              if (validationForm === false) {

                  this.dataloaded = 3;
                  this.modalMessage(
                    '',
                    'Il y\'a une erreur dans vos parametres de recherche'
                    );
                } else {
                    this.dataloaded = 1;
                    this.searchSubmit('normal');
                  }
              }
            });

          } else {
            this.dataloaded = 3;
            this.modalMessage(
              '',
              this.errorMessageNumProgram
              );
          }
  }

  //  TABLEAU RESULTATS DIFFS
  public searchSubmit(mode) {
        // JSON d'exemple qui marche :
        if(mode === 'test') {
          this.datasForm= { "channels": [ { "id": 1, "itemName": "AB 1" }, { "id": 19, "itemName": "AB 3" } ], "type": "Conducteur", "programName": "2015-00953", "datesRange": { "date1": "2017-12-31T23:00:00.000Z", "date2": "2018-03-30T22:00:00.000Z" } };
       }
      // on remplace les double quotes par des simples quotes
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
              this.totalNbrHours = this.diffService.calculateTotalHours(data);
              this.dataloaded = 2;
            } else {
              this.modalMessage('', 'Aucuns résultats');
              this.dataloaded = 3;
            }
          });
  }

  // validation des différents champs du formulaire;
  public formInputsTest() {

    if ( this.datasForm.type &&
          this.datasForm.channels.length > 0
        ) {
          if (this.datasForm.datesRange) {
            if (this.datasForm.datesRange.formatted) {
              // on re formate la date pour qu'elle corresponde aux informations attendues par le serveur
                this.datasForm.datesRange = {
                  date1: this.datasForm.datesRange.beginJsDate,
                  date2: this.datasForm.datesRange.endJsDate
                };
              }
              return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public displayErrorMessage(validator) {
    if (validator === true) {
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
  //
  public numProgramValidator() {
    this.dataloaded = 1;
    // on remplace les espaces pour éviter les bugs et erreurs de saisie;
    if (this.datasForm.programName && this.datasForm.programName.length > 0 ) {
      this.datasForm.programName = this.datasForm.programName.replace(/\s/g, '');
    }

    const numProgram = this.datasForm.programName;
    if (numProgram === '' || numProgram === undefined ) {
      this.errorMessageNumProgram = 'Champ vide';
      return false;
    } else {
      if (numProgram.indexOf('-') === -1) {
        this.errorMessageNumProgram = 'Le numéro de programme doit contenir un tiret';
        return false;
      } else {
        const numPrognam_date = numProgram.split('-')[0];
        if (numPrognam_date < '1996') {
          this.errorMessageNumProgram = 'La date ne peut pas etre inférieur à 1996';
          return false;
        } else {
          return true;
        }
      }
    }
  }
  // choisir un nom de programme dans la liste de résultats et récupérer le numéro de programme
  public selectProgName(progNumber) {
    this.datasForm.programName = progNumber;
    this.chanelsSearchList = [];
  }
  // detecter si c'est du texte ou dés numéros qui sont saisis.
  // si c'est du texte : on cherche la liste des programmes correspondants a la saisie.
  // su c'est des chiffres : on vérifie que le numéro de programme est valide;
  public onSearchChange(searchValue: any) {
    if (!isNaN(searchValue) || searchValue.indexOf('-') !== -1) {
      this.chanelsSearchList = [];
    } else {
      if (searchValue.length > 5 ) {
        this.diffService.searchProgNumbersByName(searchValue).subscribe(data => { this.chanelsSearchList = data; });
      }
    }
  }

  // réinitialiser le formulaire
  public clearSearch() {
    this.datasForm = { channels: [], type: 'Grille' };
    this.dataloaded = 0;
    this.clearDateRange();
    this.totalNbrHours = '0';
    this.currentQuery.unsubscribe();
  }

  public searchFormInit() {
    this.formLoaded = false;

    try {// ajout d'un try pour régler un probleme de test unitaire qui plantait au lancement de cette fonction d'initialisation

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
    } catch (err) {}
  }
 // vider la zone de recherche de programme quand click sur la croix affichée dans le cas ou le numéro de programme est faux;
  public clearnInputSearch() {
    this.datasForm.programName = '';
    this.dataloaded = 0;
 }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      myDateRange: ['', Validators.required]
    });
    this.searchFormInit();
    // this.diffService.searchProgNumbersByName('friends').subscribe(data => { this.chanelsSearchList = data;});
  }
}
