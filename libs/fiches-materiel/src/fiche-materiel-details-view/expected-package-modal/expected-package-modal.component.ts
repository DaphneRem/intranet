import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// service import
import { ExpectedPackageService, ExpectedPackage } from '@ab/fiches-achat';

@Component({
  selector: 'expected-package-modal',
  templateUrl: './expected-package-modal.component.html',
  styleUrls: [
    './expected-package-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    ExpectedPackageService
  ]
})
export class ExpectedPackageModalComponent implements OnInit, OnChanges {
  @Input() myFicheAchatDetails;

  closeResult: string;

  public expectedPackage: ExpectedPackage[] = [];
  public expectedPackageReady: Boolean = false;
  public changeDataReady;
  public open = 0;

  constructor(
    private modalService: NgbModal,
    private expectedPackageService: ExpectedPackageService
  ) {}

  ngOnInit() {
      console.log('call expected Package true');
      console.log(this.myFicheAchatDetails);
      this.getExpectedPackage(this.myFicheAchatDetails.id_fiche_det);
  }

  ngOnChanges(changes: SimpleChanges) {
      // const changeDataReady: SimpleChange = changes.open;
      // console.log(changeDataReady);
  }

  openLg(expectedPackage) {
    this.modalService.open(expectedPackage, { size: 'lg' , centered: true});
  }

  getExpectedPackage(id) {
    this.expectedPackageService
      .getExpectedPackage(id)
      .subscribe(data => {
        console.log(data);
        if (data === null) {
          this.expectedPackage = [];
          this.expectedPackageReady = true;
        } else {
          this.expectedPackage = data;
          this.expectedPackageReady = true;
        }
      });
  }

}

