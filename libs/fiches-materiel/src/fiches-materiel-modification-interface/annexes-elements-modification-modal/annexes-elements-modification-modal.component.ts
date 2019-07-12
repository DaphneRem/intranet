import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { AnnexElementsService } from '../../services/annex-elements.service';
import {
  AnnexElementStatus,
  AnnexElementCategory,
  AnnexElementSubCategory,
  AnnexElementFicheMAteriel
} from '../../models/annex-element';

import { AnnexElementCommentsFicheMAteriel } from '../../models/annex-elements-comments';

@Component({
  selector: 'annexes-elements-modification-modal',
  templateUrl: './annexes-elements-modification-modal.component.html',
  styleUrls: [
    './annexes-elements-modification-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [AnnexElementsService]
})
export class AnnexesElementsModificationModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() allIdSelectedFichesMateriel;
  @Input() annexElementsFicheMateriel;
  @Input() selectionType;
  @Input() annexElementsNgModel;
  @Input() originalsValuesElementsAnnexes;
  @Input() comments: AnnexElementCommentsFicheMAteriel[];
  @Input() refreshEACommentModel;
  @Input() sameEAComments;
  @Input() reload;
  @Input() resetTooltipMessage;
  @Input() replyTooltipMessage;
  @Input() valueNotToChangeLibelle;

  @Output() newStateElementsAnnexNgModel = new EventEmitter();
  @Output() newComments: EventEmitter<AnnexElementCommentsFicheMAteriel[]> = new EventEmitter();

  private onDestroy$: Subject<any> = new Subject();

  // LIB variables
  public annexElementsCategories;
  public annexElementsAllSubCategories;
  public newEAComments: AnnexElementCommentsFicheMAteriel[] = [];
  public originValuesEAComments;
  public init = 0;
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

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    // const refreshEACommentModel = changes.refreshEACommentModel;
    // const reload = changes.reload;
    const com = changes.comments;
    console.log(changes);
    console.log('CHANGEMENT DE COMMENTAIRE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', changes.comments);
    console.log('this.init => ', this.init);
    // if (!com.firstChange && this.selectionType !== 'multi') {
      if (this.init > 0 && this.selectionType !== 'multi') {
        console.log('NOT FIRST CHANGE !!!!!!!!');
        // const com: SimpleChange = changes.comments;
        // this.comments = com.currentValue;
        console.log(this.comments);
        // this.getAnnexElementsCategories();
        if (this.selectionType !== 'multi') {
          this.displayNewObjectEAComments(this.annexElementsCategories);
        } else {
          console.log('change comment multi => ', this.comments);
          this.displayOriginValuesEAComments(this.annexElementsCategories)
        }
        this.init++;
    } else if (this.init > 1 && this.selectionType === 'multi') {
      this.init++;
    }

    // console.log('comment before change format other time ==> ', this.comments);
    // console.log(this.init);
    // this.comments.filter((a, b) => this.comments.indexOf(a) === b);
    // if (this.init > 0) {
    //   this.displayNewObjectEAComments(this.annexElementsCategories);
    //   console.log('====> displayNewObjectEAComments');
    // }
    // this.init++;
  }

  openLg(annexesElementsToModif) {
    this.modalService.open(annexesElementsToModif, { size: 'lg' });
  }

/*****************************************************************************************/
/********************************** SELECTTION TYPE : ONLY *******************************/
/*****************************************************************************************/
  displayCheckedElements(id) {
    let checked = [];
    // console.log(this.annexElementsFicheMateriel);
    this.annexElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === id && item.IsValid) {
        console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      // console.log('non non non non (annex element modif action component)');
      return false;
    }
  }

  changeModel(IdLibElementAnnexes) {
    // console.log('changeModel() CALL');
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

/**************** checkbox management **************/

// first displaying checkbox
  displayCheckedOption(id) {
    console.log('displayCheckedOption CALL');
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
  changeResetModel(IdLibElementAnnexes) { // D
    console.log('changeResetModel CALL');
    this.annexElementsNgModel.map(item => {
      if (item.IdPackageAttendu === IdLibElementAnnexes) {
        if (item.IsValid === 'same') {
          item.IsValid = true;
        } else {
          console.log(item);
          item.IsValid = !item.IsValid;
          console.log(item.IsValid);
        }
      }
    });
    this.newStateElementsAnnexNgModel.emit(this.annexElementsNgModel);
    // console.log('this.annexElementsNgModel', this.annexElementsNgModel);
    // console.log('this.allIdSelectedFichesMateriel', this.allIdSelectedFichesMateriel);
  }

  checkIfValueIsNotValid(IdLibElementAnnexes): boolean {
    let itemIsNotValid: boolean;
    this.annexElementsNgModel.map(item => {
      if (item.IdPackageAttendu === IdLibElementAnnexes) {
        console.log('item.IsValid => ', item.IsValid);
        if ((item.IsValid === 'same') || item.IsValid === true) {
          itemIsNotValid = false;
        } else {
          itemIsNotValid = true;
        }
      }
    });
    return itemIsNotValid;
  }

/************************************************/
/******* ELEMENTS ANNEXES BUTTONS ACTIONS *******/

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
      this.originalsValuesElementsAnnexes.map(item2 => {
        if (item.IdPackageAttendu === item2.IdPackageAttendu) {
          item.IsValid = item2.IsValid;
        }
      });
    });
    console.log('this.originalsValuesElementsAnnexes => ', this.originalsValuesElementsAnnexes);
    // this.annexElementsNgModel = this.originalsValuesElementsAnnexes;
    console.log('this.annexElementsNgModel Afeter reset action : ', this.annexElementsNgModel);
  }


/*****************************************************************************************/
/******************************** GET LIB ANNEXES ELEMENTS *******************************/
/*****************************************************************************************/

  getAnnexElementsCategories() { // ISCALL
    console.log('getAnnexElementsCategories() from ACTION component');
    this.annexElementsService
      .getAnnexElementsCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log(data);
        if (this.selectionType !== 'multi') {
          this.displayNewObjectEAComments(this.annexElementsCategories);
        } else {
          this.displayOriginValuesEAComments(this.annexElementsCategories);
          console.log('ooooooooooooooooooooooooooo selection multi oooooooooooooooooooooooooooooooooooo');
        }
      });
  }

  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes) { // DONT CALL
    console.log('getAnnexElementsSubCategoriesByCategory() from ACTION component');
    this.annexElementsService
      .getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() { // ISCALL
    console.log('getAnnexElementsAllSubCategories() from ACTION component');
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.annexElementsAllSubCategories = data;
      });
  }

/**************************** Elements annexes comments ******************************/

  displayNewObjectEAComments(annexElementsCategories) {
    this.newEAComments = [];
    let categories = [];
    this.annexElementsCategories.map(item => {
      if (this.comments.length > 0) {
        this.comments.map(comment => {
          console.log(comment);
          if (comment.idLibCategorieElementsAnnexes === item.IdLibCategorieElementsAnnexes) {
            this.newEAComments.push(comment);
            categories.push(item.IdLibCategorieElementsAnnexes);
          } else {
            if (!this.comments.includes(comment)) {
              this.newEAComments.push({
                IdCategorieElementsAnnexesCommentaire: 0,
                idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
                IdFicheMateriel: this.allIdSelectedFichesMateriel[0].IdFicheMateriel,
                Commentaire: ''
              });
            }
          }
      });
    } else {
      // this.newEAComments.push({
      //   IdCategorieElementsAnnexesCommentaire: 0,
      //   idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
      //   IdFicheMateriel: this.allIdSelectedFichesMateriel[0].IdFicheMateriel,
      //   Commentaire: ''
      // });
      // console.log('category without comment => ', item);

    }
    });
    this.annexElementsCategories.map(item => {
      if (!categories.includes(item.IdLibCategorieElementsAnnexes)) {
        this.newEAComments.push({
          IdCategorieElementsAnnexesCommentaire: 0,
          idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
          IdFicheMateriel: this.allIdSelectedFichesMateriel[0].IdFicheMateriel,
          Commentaire: ''
        });
      }
     });
    this.comments = this.newEAComments;

    this.newComments.emit(this.newEAComments);






    // this.newEAComments = [];
    // console.log('this.comments ==> ', this.comments);
    // console.log('annexElementsCategories ==> ', annexElementsCategories);
    // console.log('annexElementsCategories ==> ', this.newEAComments);
    // let categories = annexElementsCategories;
    // categories.map(item => {
    //   if (this.comments.length > 0) {
    //     this.comments.map(comment => {
    //       if (comment.idLibCategorieElementsAnnexes === item.IdLibCategorieElementsAnnexes) {
    //         console.log('comment idcategory same => ', comment);
    //         this.newEAComments.push(comment);
    //       } else {
    //         console.log(this.comments.includes(comment));
    //         if (!this.comments.includes(comment)) {
    //           this.newEAComments.push({
    //             IdCategorieElementsAnnexesCommentaire: 0,
    //             idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
    //             IdFicheMateriel: this.allIdSelectedFichesMateriel[0].IdFicheMateriel,
    //             Commentaire: ''
    //           });
    //           console.log('comment idcategory different => ', comment);
    //         }
    //       }
    //   });
    // } else {
    //   this.newEAComments.push({
    //     IdCategorieElementsAnnexesCommentaire: 0,
    //     idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
    //     IdFicheMateriel: this.allIdSelectedFichesMateriel[0].IdFicheMateriel,
    //     Commentaire: ''
    //   });
    //   console.log('category without comment => ', item);

    // }
    // console.log('COMMENT ALL AFTER change model ===============================================================> ', this.newEAComments);
    // });
    // this.comments = this.newEAComments;
    // this.newComments.emit(this.newEAComments);
  }

  /***** SELECTION TYPE MULTI ****/
  public allComments = []; 
  public odlSameComments = [];
  displayOriginValuesEAComments(annexElementsCategories) { // ISCALL
    this.originValuesEAComments = [];
    this.sameEAComments.map(item => {
      this.odlSameComments.push({
        id: item.idLibCategorieElementsAnnexes,
        value: item.Commentaire
      });
    });
    this.originValuesEAComments = this.sameEAComments;
    this.allComments = [];
    let sameValueIdLibCategorieElementsAnnexes = [];
    this.originValuesEAComments.map(e => {
      sameValueIdLibCategorieElementsAnnexes.push(e.idLibCategorieElementsAnnexes);
    });

    this.annexElementsCategories.map(item => {
      if (!sameValueIdLibCategorieElementsAnnexes.includes(item.IdLibCategorieElementsAnnexes)) {
          this.allComments.push({
            IdCategorieElementsAnnexesCommentaire: 'same',
            idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
            IdFicheMateriel: 'same',
            Commentaire: this.valueNotToChangeLibelle
          });
        }
      });
    // this.annexElementsCategories.map(item => {
    //   this.originValuesEAComments.map(e => {
    //     console.log('item.IdLibCategorieElementsAnnexes => ', item.IdLibCategorieElementsAnnexes);
    //     console.log('e.idLibCategorieElementsAnnexes => ', e.idLibCategorieElementsAnnexes);
    //     if (item.IdLibCategorieElementsAnnexes !== e.idLibCategorieElementsAnnexes) {
    //       this.allComments.push({
    //         IdCategorieElementsAnnexesCommentaire: 'same',
    //         idLibCategorieElementsAnnexes: item.IdLibCategorieElementsAnnexes,
    //         IdFicheMateriel: 'same',
    //         Commentaire: 'valeur d\'origine'
    //       });
    //     }
    //   });
    // });
    this.sameEAComments.map(item => {
      this.allComments.push(item);
    });
    this.newComments.emit(this.allComments);
  }


  checkIfIsNotOriginalProperty(idCategory, value) {
    let oldCategory = [];
    this.odlSameComments.map(item => {
      if (item.id === idCategory) {
          oldCategory.push(item);
      }
    });
    if (oldCategory.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  checkIfDifferentOriginalComment(idCategory, value): boolean {
    let sameIdCategory = [];
    this.odlSameComments.map(item => {
      if (item.id === idCategory) {
        if (value !== item.value) {
          sameIdCategory.push(item);
        }
      }
    });
    if (sameIdCategory.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  returnToOriginalComment(idCategory, value) {
    let koo;
    this.odlSameComments.map(item => {
      if (item.id === idCategory) {
        koo = item.value;
      }
    });
    this.allComments.map(item => {
      if (item.idLibCategorieElementsAnnexes === idCategory) {
        item.Commentaire = koo;
      }
    });
  }

  checkCommentExistInModel(comment): boolean {
    let commentExist = [];
    this.comments.map(item => {
      if (item.idLibCategorieElementsAnnexes === comment.idLibCategorieElementsAnnexes) {
        commentExist.push(item);
      }
    });
    if (commentExist.length > 0) {
      return true;
    } else {
      return false;
    }
  }

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
