import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
export class ExpectedPackageModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() myFicheAchatDetails;

  closeResult: string;

  private onDestroy$: Subject<any> = new Subject();

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

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  openLg(expectedPackage) {
    this.modalService.open(expectedPackage, { size: 'lg' , centered: true});
  }

  getExpectedPackage(id) {
    this.expectedPackageService
      .getExpectedPackage(id)
      .pipe(takeUntil(this.onDestroy$))
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

