import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  EventEmitter
} from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'steps-status-comment-modal',
  templateUrl: './steps-status-comment-modal.component.html',
  styleUrls: ['./steps-status-comment-modal.component.scss']
})
export class StepsStatusCommentModalComponent implements OnInit, OnChanges {
  @Input() selectionType;
  @Input() step;
  @Input() status;
  @Input() newObject;
  @Input() allFichesMateriel;
  @Input() valueNotToChangeLibelle;

  @Output() lastStatus = new EventEmitter<string>();
  @Output() newComment = new EventEmitter<string>();

  public init = 0;
  public stepsStatusComment: string;
  public previousValueStatus;
  public previousValueStep;
  public addCommentStepStatus = true;
  public openWarningSwalModal = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    // console.log('INIT => ', this.init);
    if ((changes.status) && (changes.status)) {
      // console.log('change STEP + STATUS');
      const changeStatus: SimpleChange = changes.status;
      // console.log(changes.status.firstChange);
      if (typeof changeStatus.previousValue !== 'undefined') {
        this.previousValueStatus = changeStatus.previousValue;
      }
      if (this.init) {
        // ne se lance pas à l'initialisation du composant
        if (changeStatus.currentValue === 3) {
          // console.log('change Statut current value => ', changeStatus.currentValue);
          // console.log(this.allFichesMateriel.length);
          // console.log(this.newObject.IdStatutElementsAnnexes);
          // console.log(this.newObject.Renouvellement);
          // console.log(typeof this.newObject.DateAcceptation);
          // console.log(this.newObject.DateAcceptation);
          // console.log(this.newObject.IdStatutElementsAnnexes);
          let statusIsOk = false;
          let renouvellementIsOk = false;
          let dateAcceptationIsOk = false;
          if (this.newObject.IdStatutElementsAnnexes === 3) {
            statusIsOk = true;
          } else {
            statusIsOk = false;
          }
          if (
              this.newObject.Renouvellement === this.valueNotToChangeLibelle
              || this.newObject.Renouvellement === 0
              || this.newObject.Renouvellement === null
            ) {
              renouvellementIsOk = false;
            } else {
              renouvellementIsOk = true;
          }
          if (
              this.newObject.DateAcceptation === null
              || this.newObject.DateAcceptation === this.valueNotToChangeLibelle
              || this.newObject.DateAcceptation === 'dd-mm-yyyy'
            ) {
              dateAcceptationIsOk = false;
            } else {
              dateAcceptationIsOk = true;
          }
          // if (
          //     (this.newObject.IdStatutElementsAnnexes !== 3)
          //     || (
          //         (this.newObject.Renouvellement === this.valueNotToChangeLibelle)
          //         || (this.newObject.DateAcceptation === this.valueNotToChangeLibelle)
          //         || (this.newObject.DateAcceptation === 'dd-mm-yyyy')
          //       )
          //     || (
          //         (this.newObject.Renouvellement === 0 || this.newObject.Renouvellement === null)
          //         && (this.newObject.DateAcceptation === null || this.newObject.DateAcceptation === 'dd-mm-yyyy' || this.newObject.DateAcceptation === this.valueNotToChangeLibelle)
          //         )
          //   ) {
          // console.log('statusIsOk => ', statusIsOk);
          // console.log('renouvellementIsOk => ', renouvellementIsOk);
          // console.log('dateAcceptationIsOk => ', dateAcceptationIsOk);
          if (!statusIsOk || (!renouvellementIsOk && !dateAcceptationIsOk)) {
            // console.log('warning modal call');
            this.openWarningSwalModal = true;
            this.openWarningSwal();
          // } else if (this.allFichesMateriel.length > 1) {
          //   const arrayIdStatutElementsAnnexes = [];
          //   const arrayRenouvellementDateAcceptation = [];
          //   const arrayDateAcceptation = [];
          //   this.allFichesMateriel.forEach(item => {
          //     if (item.IdStatutElementsAnnexes === 3) {
          //       arrayIdStatutElementsAnnexes.push(item);
          //     } // A CHANGER A PARTIR DE LA :
          //     if ((item.Renouvellement && item.DateAcceptation !== null) || (!item.Renouvellement && item.DateAcceptation === null)) {
          //       arrayRenouvellementDateAcceptation.push(item);
          //     }
          //   });
          //   if (arrayIdStatutElementsAnnexes.length || arrayRenouvellementDateAcceptation) {
          //     this.openWarningSwal();
          //   }
          } else {
            // console.log('!openswalWArning : all options are good for comment');
            this.openCommentSwal();
          }
        } else {
          if (this.addCommentStepStatus) {
            // console.log('add comment statut without change step');
            if (this.init > 1 && this.selectionType === 'multi') {
              this.openCommentSwal();
            } else if (this.selectionType !== 'multi') {
              this.openCommentSwal();
            }
          }
        }
      }
      // this.init++;
      // this.addCommentStepStatus = true;
    } else if ((changes.step) && (!changes.status)) {
      // console.log(changes.status);
      // console.log(changes.status);
      if (!changes.status) {
        // console.log('change STEP');
        const changeStep: SimpleChange = changes.step;
        // console.log(changes.step.firstChange);
        if (typeof changeStep.previousValue !== 'undefined') {
            this.previousValueStep = changeStep.previousValue;
        }
        // console.log(changeStep);
        if (this.init && !this.openWarningSwalModal) {
          // console.log('add comment');
          this.openCommentSwal();
        }
        // this.init++;
        // this.addCommentStepStatus = true;
      }
    }
    this.init++;
    this.addCommentStepStatus = true;
  }

  onCommentChange(comment: string) {
    this.newComment.emit(comment);
  }

  onStatusChange(lastValueStatus: string) {
    this.lastStatus.emit(lastValueStatus);
  }

  openCommentSwal() {
    swal({
      title: 'Ajouter un commentaire',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'Aucun Commentaire',
      confirmButtonText: 'Valider',
      confirmButtonColor: 'rgb(23, 170, 178)',
    }).then((result) => {
      if (result.value) {
        this.stepsStatusComment = result.value;
        this.onCommentChange(result.value);
        // console.log(this.stepsStatusComment);
      }
    });
  }

  openWarningSwal() {
    swal({
      type: 'error',
      text:
      `Pour changer le statut en « Accepté »,
        les éléments annexes doivent être marqués comme traités et une date
        d’acceptation doit être renseignée (si différent de renouvellement).
        Vérifiez que ces conditions soient remplies et réessayez.`,
      confirmButtonColor: 'rgb(23, 170, 178)',
    }).then((result) => {
      this.onStatusChange(this.previousValueStatus);
      this.addCommentStepStatus = false;
      this.openWarningSwalModal = false;
    });
  }

}
