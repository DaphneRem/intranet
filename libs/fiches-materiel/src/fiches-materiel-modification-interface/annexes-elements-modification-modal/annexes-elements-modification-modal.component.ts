import { Component, OnInit, Input } from '@angular/core';
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
  styleUrls: ['./annexes-elements-modification-modal.component.scss'],
    providers: [AnnexElementsService]
})
export class AnnexesElementsModificationModalComponent implements OnInit {
  // @Input() annexElementsCategories;
  // @Input() annexElementsAllSubCategories;
  @Input() allIdSelectedFichesMateriel;
  @Input() annexElementsFicheMateriel;
  @Input() selectionType;

  public annexElementModel;

  public annexElementsCategories;
  public annexElementsAllSubCategories;

  constructor(
    private modalService: NgbModal,
    private annexElementsService: AnnexElementsService
  ) { }

  ngOnInit() {
    this.getAnnexElementsCategories();
    this.getAnnexElementsAllSubCategories();
    console.log(this.annexElementsFicheMateriel);
    if (this.selectionType === 'multi') {
      this.getAnnexElementsFicheMateriel(this.allIdSelectedFichesMateriel[0].IdFicheMateriel);
    }
  }

  openLg(annexesElementsToModif) {
    this.modalService.open(annexesElementsToModif, { size: 'lg' });
  }

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

/********************** selection Type === 'multi' ****************************/
  displayCheckedOption() {

  }
/******************************** GET ANNEXES ELEMENTS *******************************/

  getAnnexElementsFicheMateriel(IdFicheMateriel) {
    this.annexElementsService
      .getAnnexElementsFicheMateriel(IdFicheMateriel)
      .subscribe(data => {
        this.annexElementModel = data;
        console.log(data);
        // this.annexElementModel.map(item => {
        //   item.IsValid = 'same';
        // });
        // console.log(this.annexElementModel);
      });
  }

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

  /************************** Buttons 'Elements annexes' *****************************/

  checkModifiedElementAnnex(annexElementArray, value, state) {
    let modifiedElement = [];
    annexElementArray.map(item => {
      if (state === 'same') {
        if (item.IsValid === value) {
          modifiedElement.push(item);
        }
      } else if (state === 'different') {
        if (item.IsValid !== value) {
          modifiedElement.push(item);
        }
      }
    });
    if (modifiedElement.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  resetElementAnnex(annexElementArray, value) {
    return annexElementArray.map(item => {
      item.IsValid = value;
    });
  }
  /********************************************************************************/

}
