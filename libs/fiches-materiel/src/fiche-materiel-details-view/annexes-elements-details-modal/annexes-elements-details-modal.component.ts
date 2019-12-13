import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
  selector: 'annexes-elements-details-modal',
  templateUrl: './annexes-elements-details-modal.component.html',
  styleUrls: [
    './annexes-elements-details-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [AnnexElementsService]
})
export class AnnexesElementsDetailsModalComponent implements OnInit, OnDestroy {
  @Input() IdFicheMateriel;

  private onDestroy$: Subject<any> = new Subject();

  public annexElementsCategories;
  public annexElementsAllSubCategories;
  public annexesElementsFicheMateriel;
  public comments: AnnexElementCommentsFicheMAteriel[];

  constructor(
    private modalService: NgbModal,
    private annexElementsService: AnnexElementsService
  ) { }

  ngOnInit() {
    this.getAnnexElementsCategories(); // with comments
    this.getAnnexElementsAllSubCategories();
    this.getAnnexElementsFicheMateriel(this.IdFicheMateriel);
    this.getCommentaireAnnexElementsFicheMateriel(this.IdFicheMateriel);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  openLg(annexesElements) {
    this.modalService.open(annexesElements, { size: 'lg' });
  }

  checkElementIsValid(id) {
    let checked = [];
    console.log(this.annexesElementsFicheMateriel);
    this.annexesElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === id && item.IsValid) {
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


/******************************** GET ANNEXES ELEMENTS *******************************/

  getAnnexElementsFicheMateriel(IdFicheMateriel: number) {
    this.annexElementsService
      .getAnnexElementsFicheMateriel(IdFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexesElementsFicheMateriel = data;
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
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() {
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('getAnnexElementsAllSubCategories() data => ', data);
        data.sort((a, b) => a.ordre - b.ordre);
        this.annexElementsAllSubCategories = data;
        console.log('getAnnexElementsAllSubCategories() data after sort() => ', data);
      });
  }

/*************** Comments *****************/

  getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel: number) {
    console.log('IdFicheMateriel => ', IdFicheMateriel);
    this.annexElementsService
      .getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('Commentaire Elements Annexes Fiches Matériel ============================================>', data);
        this.comments = data;
      });
  }

}
