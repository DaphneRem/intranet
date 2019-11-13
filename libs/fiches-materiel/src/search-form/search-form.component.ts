import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';
import { FicheMaterielComplexSearch } from '../models/fiche-materiel-complex-search';
import { complexSearchInit } from './complex-search-init';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: [
    './search-form.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    FichesMaterielService
  ]
})
export class SearchFormComponent implements OnInit {
  @Input() autofields;
  @Input() title;
  @Output() dataResult = new EventEmitter<FicheMateriel[]>();
  @Output() reloadOriginalData = new EventEmitter<boolean>();

  constructor(private fichesMaterielService: FichesMaterielService) { }


  public fmParameterToPost: FicheMaterielComplexSearch;
  public fmFromComplexSearch: FicheMateriel[];
  public resultComplexSearchExist: boolean;
  public errorMesssage: string;
  public displayOldComplexSearch: boolean = false;
  public oldComplexSearch = {
    SuiviPar: '',
    TitreEpisodeVO: '',
    TitreEpisodeVF: '',
    isarchived: 2,
    distributeur: '',
    numficheachat: ''
  };
  public complexSearchModel = {
    SuiviPar: '',
    TitreEpisodeVO: '',
    TitreEpisodeVF: '',
    isarchived: 2,
    distributeur: '',
    numficheachat: ''
  };

  ngOnInit() {
    if (this.autofields) {
      this.complexSearchModel.SuiviPar = this.autofields.SuiviPar;
      this.complexSearchModel.isarchived = this.autofields.isarchived;
    }
    this.fmParameterToPost = complexSearchInit;
  }

  resetForm() {
    this.complexSearchModel = {
      SuiviPar: '',
      TitreEpisodeVO: '',
      TitreEpisodeVF: '',
      isarchived: 2,
      distributeur: '',
      numficheachat: ''
    };
    for (let property in this.complexSearchModel) {
      if (this.fmParameterToPost[property]) {
        this.fmParameterToPost[property] = this.complexSearchModel[property];
      }
    }
    if (this.autofields) {
      this.complexSearchModel.SuiviPar = this.autofields.SuiviPar;
      this.complexSearchModel.isarchived = this.autofields.isarchived;
    }
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

  displaySearchForm() {
    console.log('displaySearchForm');
    console.log('this.complexSearchModel => ', this.complexSearchModel);
    console.log('this.autofields => ', this.autofields);
    this.oldComplexSearch = {
      SuiviPar: '',
      TitreEpisodeVO: '',
      TitreEpisodeVF: '',
      isarchived: 2,
      distributeur: '',
      numficheachat: ''
    };
    if (JSON.stringify(this.complexSearchModel) !== JSON.stringify(this.autofields)) {
      for (let property in this.fmParameterToPost) {
        if ((this.complexSearchModel[property])) {
          console.log('diff property => ', property, this.complexSearchModel[property]);
          this.fmParameterToPost[property] = this.complexSearchModel[property];
          this.oldComplexSearch[property] = this.complexSearchModel[property];
        }
      }
      console.log('this.fmParameterToPost after update => ', this.fmParameterToPost);
      this.getFichesMaterielsComplexSearch(this.fmParameterToPost);
    } else {
      this.displayOldComplexSearch = false;
      console.log('same value for this.complexSearchModel & this.autofields');
    }
  }

  replyOriginalData() {
    this.resultComplexSearchExist = true;
    this.reloadOriginalData.emit(true);
    this.resetForm();
    this.oldComplexSearch = null;
    this.displayOldComplexSearch = false;
  }

  sendDataResult() {
    this.dataResult.emit(this.fmFromComplexSearch);
  }

}
