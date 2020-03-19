import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { SearchHistoryFormInterface } from './+state/search-history-form.interfaces';

import { RoutingState } from '../services/routing-state.service';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';
import { FicheMaterielComplexSearch } from '../models/fiche-materiel-complex-search';
import { complexSearchInit } from './complex-search-init';
import { getDateFromRecurrenceDateString } from '@syncfusion/ej2-schedule/src/recurrence-editor/date-generator';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: [
    './search-form.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    FichesMaterielService,
    Store
  ]
})
export class SearchFormComponent implements OnInit {
  @Input() autofields;
  @Input() title;
  @Input() getDataOnInit?: boolean;
  @Input() showAllDataBtnOption: boolean;
  @Input() showOnlyInProgressBtn?: boolean;

  @Output() dataResult = new EventEmitter<FicheMateriel[]>();
  @Output() reloadOriginalData = new EventEmitter<boolean>();

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private store: Store<SearchHistoryFormInterface>,
    private routingState: RoutingState
  ) { }

  public globalStore;
  public storeSearchHistoryFormData;
  public previousUrl;
  public fmParameterToPost: FicheMaterielComplexSearch;
  public fmFromComplexSearch: FicheMateriel[];
  public resultComplexSearchExist: boolean;
  public errorMesssage: string;
  public displayOldComplexSearch: boolean = false;
  public inProgressChecked: boolean = false;
  public oldComplexSearch = {
    SuiviPar: '',
    TitreEpisodeVO: '',
    TitreEpisodeVF: '',
    isarchived: 2,
    distributeur: '',
    numficheachat: '',
    Isdeal: 2
  };
  public complexSearchModel = {
    SuiviPar: '',
    TitreEpisodeVO: '',
    TitreEpisodeVF: '',
    isarchived: 2,
    distributeur: '',
    numficheachat: '',
    Isdeal: 2
  };

  ngOnInit() {
    console.log('showOnlyInProgressBtn => ', this.showOnlyInProgressBtn);
    this.fmParameterToPost = complexSearchInit;
    this.previousUrl = this.routingState.getPreviousUrl();
    this.store.subscribe(data => (this.globalStore = data));
    console.log('this.globalStore => ', this.globalStore);
    this.storeSearchHistoryFormData = this.globalStore.searchHistoryForm;
    console.log('this.storeSearchHistoryFormData => ', this.storeSearchHistoryFormData);
    this.displayComplexSearchModel();
    console.log('this.complexSearchModel => ', this.complexSearchModel);
  }


  displayComplexSearchModel() { // Call only onInit
    let detailUrl = 'details';
    let modifUrl = 'modification';
    console.log(this.previousUrl);
    if ((typeof this.previousUrl !== 'undefined') || (this.previousUrl)) {
      if (this.previousUrl.includes(detailUrl) || this.previousUrl.includes(modifUrl)) {
        this.complexSearchModel = this.storeSearchHistoryFormData;
        // this.displayDefaultFields();
        if (this.showOnlyInProgressBtn) {
          if (this.complexSearchModel.isarchived === 0) {
            this.inProgressChecked = true;
          }
          this.displaySearchForm();
        } else {
          this.resetSearchFormStore();
          this.displayDefaultFields();
          this.displaySearchForm();
        }
//        if ((this.complexSearchModel.isarchived === 0) && this.showOnlyInProgressBtn) {
//          this.inProgressChecked = true;
//        }
//        this.displaySearchForm();
      } else {
        console.log('this.previousUrl => ', this.previousUrl);
        this.resetSearchFormStore();
        this.displayDefaultFields();
        if (this.getDataOnInit) {
          console.log('replayOriginalData() call');
          this.replyOriginalData();
        }
      }
    } else {
      console.log('this.previousUrl2 => ', this.previousUrl);
      this.resetSearchFormStore();
      this.displayDefaultFields();
    }
  }

  displayDefaultFields() {
    if (this.autofields) {
      this.complexSearchModel.SuiviPar = this.autofields.SuiviPar;
      this.complexSearchModel.isarchived = this.autofields.isarchived;
      this.complexSearchModel.Isdeal = this.autofields.Isdeal;

   //   this.oldComplexSearch.SuiviPar = this.autofields.SuiviPar;
    //  this.oldComplexSearch.isarchived = this.autofields.isarchived;
    }
    console.log('this.complexSearchModel.SuiviPar => ', this.complexSearchModel.SuiviPar);
  }

  addComplexSearchToStore(storeState) {
    this.store.dispatch({
      type: 'ADD_SEARCH_HISTORY-FORM',
      payload: storeState
    });
  }

  resetSearchFormStore() {
    this.store.dispatch({ type: 'RESET_SEARCH_HISTORY-FORM' });
  }


  resetForm() {
    this.complexSearchModel = {
      SuiviPar: '',
      TitreEpisodeVO: '',
      TitreEpisodeVF: '',
      isarchived: 2,
      distributeur: '',
      numficheachat: '',
      Isdeal: 2
    };
    for (let property in this.complexSearchModel) {
      if (this.fmParameterToPost[property]) {
        this.fmParameterToPost[property] = this.complexSearchModel[property];
      }
    }
    this.displayDefaultFields();
  }

  getFichesMaterielsComplexSearch(searchObject: FicheMaterielComplexSearch) {
    console.log('searchObject (parameter for FMcomplexSearch) => ', searchObject);
    this.fichesMaterielService
      .getFichesMAterielWithComplexSearch(searchObject)
      .subscribe(data => {
        if (data) {
          this.resultComplexSearchExist = true;
          this.displayOldComplexSearch = true;
          this.fmFromComplexSearch = data;
          this.sendDataResult();
          console.log('this.fmFromComplexSearch => ', this.fmFromComplexSearch);
          this.resetForm();
        } else {
          console.log('NO DATA FOR COMPLEXSEARCH => ', data);
          this.resultComplexSearchExist = false;
          this.displayOldComplexSearch = false;
          this.oldComplexSearch = null;
          this.errorMesssage = 'Aucune fiche Matériel ne correspond à la recherche';
          this.resetForm();
        }
      }, error => {
        swal({
          type: 'error',
          text:
          `Une erreur est survenue, la recherche n'a pas pu aboutir`,
          confirmButtonColor: 'rgb(23, 170, 178)',
        });
        this.resetForm();
        this.displayOldComplexSearch = false;
      });
  }

  displaySearchForm() { // call onInit and search btn onclick
    console.log('displaySearchForm');
    console.log('this.complexSearchModel => ', this.complexSearchModel);
    console.log('this.fmParameterToPost => ', this.fmParameterToPost);
    console.log('this.oldComplexSearch => ', this.oldComplexSearch);
    console.log('this.autofields => ', this.autofields);

    console.log('this.showOnlyInProgressBtn => ', this.showOnlyInProgressBtn );
    if (this.oldComplexSearch === null) {
      console.log('this oldComplexSearch is null => ', this.oldComplexSearch);
      this.oldComplexSearch = {
        SuiviPar: '',
        TitreEpisodeVO: '',
        TitreEpisodeVF: '',
        isarchived: 2,
        distributeur: '',
        numficheachat: '',
        Isdeal: 2
      };
    }
    if (this.showOnlyInProgressBtn && this.inProgressChecked) {
      console.log('this.oldComplexSearch => ', this.oldComplexSearch);
      console.log('this.changeOldComplexSearchArchived => ', this.changeOldComplexSearchArchived);

      this.oldComplexSearch.isarchived = this.changeOldComplexSearchArchived;
      console.log('this.oldComplexSearch => ', this.oldComplexSearch);

    }
    console.log('this.oldComplexSearch after show in progress change => ', this.oldComplexSearch);
    if (JSON.stringify(this.complexSearchModel) !== JSON.stringify(this.autofields)) {
      for (let property in this.fmParameterToPost) {
        if (this.complexSearchModel.hasOwnProperty(property)) {
          console.log('diff property => ', property, this.complexSearchModel[property]);
          console.log('this.fmParameterToPost[property] => ', this.fmParameterToPost[property]);
          console.log('this.oldComplexSearch[property] => ', this.oldComplexSearch[property]);
          this.fmParameterToPost[property] = this.complexSearchModel[property];
          this.oldComplexSearch[property] = this.complexSearchModel[property];
        } else {
          console.log('property in thiq.fmParameterToPost => ', property, this.fmParameterToPost[property]);
          console.log('this.complexSearchModel => ', property, this.complexSearchModel[property]);
          console.log('this.oldComplexSearch => ', this.oldComplexSearch);
        }
      }
      console.log('this.fmParameterToPost => ', this.fmParameterToPost);
      console.log('this.oldComplexSearch => ', this.oldComplexSearch);
      this.addComplexSearchToStore(this.oldComplexSearch);
      console.log('this.fmParameterToPost after update => ', this.fmParameterToPost);
      this.getFichesMaterielsComplexSearch(this.fmParameterToPost);
    } else {
      this.displayOldComplexSearch = false;
      if (this.getDataOnInit) {
        console.log('if getDataOnInit call replyOriginalData()');
        this.replyOriginalData();
      }
      console.log('same value for this.complexSearchModel & this.autofields');
    }
  }

  replyOriginalData() {
    this.resultComplexSearchExist = true;
    this.reloadOriginalData.emit(true);
    this.resetForm();
    this.oldComplexSearch = null;
    this.displayOldComplexSearch = false;
    console.log('replyOriginalData() this.oldComplexSearch => ', this.oldComplexSearch);
  }

  sendDataResult() {
    this.dataResult.emit(this.fmFromComplexSearch);
  }
  public changeOldComplexSearchArchived;
  checkOnlyInprogressChecked() {
    console.log('this.inProgressChecked before changement => ', this.inProgressChecked);
    this.inProgressChecked = !this.inProgressChecked;
    console.log('this.inProgressChecked after changement => ', this.inProgressChecked);
    if (this.inProgressChecked && this.showOnlyInProgressBtn) {
      this.complexSearchModel.isarchived = 0;
      this.changeOldComplexSearchArchived = 0;
      this.autofields.isarchived = 0;

    } else if (!this.inProgressChecked && this.showOnlyInProgressBtn) {
      this.complexSearchModel.isarchived = 2;
      this.changeOldComplexSearchArchived = 2;
      this.autofields.isarchived = 2;

    }
    console.log('this.changeOldComplexSearchArchived => ', this.changeOldComplexSearchArchived);
    console.log('inProgressChecked => ', this.inProgressChecked);
    console.log('showOnlyInProgressBtd => ', this.showOnlyInProgressBtn);
    console.log('this.autofields => ', this.autofields);
  }
}
