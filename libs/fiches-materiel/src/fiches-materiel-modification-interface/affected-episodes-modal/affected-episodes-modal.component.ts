import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'affected-episodes-modal',
  templateUrl: './affected-episodes-modal.component.html',
  styleUrls: [
    './affected-episodes-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class AffectedEpisodesModalComponent implements OnInit {
  @Input() allFichesMateriel;

  public sortFichesMateriel;

  constructor( private modalService: NgbModal ) { }

  ngOnInit() {
    this.allFichesMateriel.sort(function(a, b) {
      return a.IdFicheMateriel - b.IdFicheMateriel;
    });
    console.log(this.allFichesMateriel);
    this.sortFichesMaterielByEps();
    console.log(this.sortFichesMateriel);
  }

  openLg(affectedEps) {
    this.modalService.open(affectedEps, { size: 'lg' });
  }

  sortFichesMaterielByEps() {
    this.sortFichesMateriel = this.allFichesMateriel.sort((a, b) => {
      return Number(a.IdFicheMateriel) - Number(b.IdFicheMateriel);
    });
    console.log(this.sortFichesMateriel);
  }

}
