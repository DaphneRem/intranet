import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AnnexElementsService } from '../../services/annex-elements.service';
import {
  AnnexElementStatus,
  AnnexElementCategory,
  AnnexElementSubCategory,
  AnnexElementFicheMAteriel
} from '../../models/annex-element';

@Component({
  selector: 'annexes-elements-modification-modal',
  templateUrl: './annexes-elements-modification-modal.component.html',
  styleUrls: [
    './annexes-elements-modification-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [AnnexElementsService]
})
export class AnnexesElementsModificationModalComponent implements OnInit {
  @Input() allIdSelectedFichesMateriel;
  @Input() annexElementsFicheMateriel;
  @Input() selectionType;
  @Input() annexElementsNgModel;

  @Output() newStateElementsAnnexNgModel = new EventEmitter();

  // LIB variables
  public annexElementsCategories;
  public annexElementsAllSubCategories;

  constructor(
    private modalService: NgbModal,
    private annexElementsService: AnnexElementsService
  ) { }

  ngOnInit() {
    this.getAnnexElementsCategories();
    this.getAnnexElementsAllSubCategories();
    console.log('onInit modification interface this.annexElementsNgModel : ', this.annexElementsNgModel);
    console.log('this.annexElementsFicheMateriel --------------------', this.annexElementsFicheMateriel);
    console.log('this.allIdSelectedFichesMateriel', this.allIdSelectedFichesMateriel);
  }

  openLg(annexesElementsToModif) {
    this.modalService.open(annexesElementsToModif, { size: 'lg' });
  }

/*****************************************************************************************/
/********************************** SELECTTION TYPE : ONLY *******************************/
/*****************************************************************************************/
  displayCheckedElements(id) {
    let checked = [];
    console.log(this.annexElementsFicheMateriel);
    this.annexElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === id && item.IsValid) {
        console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      console.log('non non non non');
      return false;
    }
  }

  changeModel(IdLibElementAnnexes) {
    this.annexElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === IdLibElementAnnexes) {
        console.log(item);
        item.IsValid = !item.IsValid;
        console.log(item.isValid);
      }
    });
  }

/*****************************************************************************************/
/***************************** SELECTTION TYPE : MULTI MODIF *****************************/
/*****************************************************************************************/

/******** checkbox management ********/

// first displaying checkbox
  displayCheckedOption(id) {
    let checked = [];
    this.annexElementsNgModel.map(item => {
      if ((item.IdPackageAttendu === id) && (item.IsValid !== 'same') && (item.IsValid !== false)) {
        console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      return false;
    }
  }

// click checkbox
  changeResetModel(IdLibElementAnnexes) {
    this.annexElementsNgModel.map(item => {
      if (item.IdPackageAttendu === IdLibElementAnnexes) {
        if (item.IsValid === 'same') {
          item.IsValid = true;
        } else {
          item.IsValid = !item.IsValid;
        }
      }
    });
    this.newStateElementsAnnexNgModel.emit(this.annexElementsNgModel);
    // console.log('this.annexElementsNgModel', this.annexElementsNgModel);
    // console.log('this.allIdSelectedFichesMateriel', this.allIdSelectedFichesMateriel);
  }

// clear all data (all values = false)
  clearAllAnnexElementsValue() {
    console.log('ACTION : clearAllAnnexElementsValue()');
    this.annexElementsNgModel.map(item => {
      item.IsValid = false;
    });
    console.log('this.annexElementsNgModel Afeter clear action : ', this.annexElementsNgModel);
  }

// reset all data (all values = 'same')
  resetAllAnnexElementsValue() {
    console.log('ACTION : resetAllAnnexElementsValue()');
    this.annexElementsNgModel.map(item => {
      item.IsValid = 'same';
    });
    console.log('this.annexElementsNgModel Afeter reset action : ', this.annexElementsNgModel);
  }

/*************************************/

/*****************************************************************************************/
/******************************** GET LIB ANNEXES ELEMENTS *******************************/
/*****************************************************************************************/

  getAnnexElementsCategories() {
    this.annexElementsService
      .getAnnexElementsCategories()
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log(data);
      });
  }

  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes) {
    this.annexElementsService
      .getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes)
      .subscribe(data => {
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() {
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
      .subscribe(data => {
        console.log(data);
        this.annexElementsAllSubCategories = data;
      });
  }

/*****************************************************************************************/

/************************** Buttons 'Elements annexes' *****************************/

  // checkModifiedElementAnnex(annexElementArray, value, state) {
  //   let modifiedElement = [];
  //   annexElementArray.map(item => {
  //     if (state === 'same') {
  //       if (item.IsValid === value) {
  //         modifiedElement.push(item);
  //       }
  //     } else if (state === 'different') {
  //       if (item.IsValid !== value) {
  //         modifiedElement.push(item);
  //       }
  //     }
  //   });
  //   if (modifiedElement.length > 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  /********************************************************************************/

}
