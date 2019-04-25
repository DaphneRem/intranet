import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class AnnexesElementsDetailsModalComponent implements OnInit {
  @Input() IdFicheMateriel;

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
      .subscribe(data => {
        this.annexElementsCategories = data;
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

/*************** Comments *****************/

  getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel: number) {
    console.log('IdFicheMateriel => ', IdFicheMateriel);
    this.annexElementsService.getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel)
      .subscribe(data => {
        console.log('Commentaire Elements Annexes Fiches Matériel ============================================>', data);
        this.comments = data;
      });
  }

}
