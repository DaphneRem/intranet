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
  @Input() step;
  @Input() status;
  @Input() newObject;
  @Input() allFichesMateriel;

  @Output() lastStatus = new EventEmitter<string>();
  @Output() newComment = new EventEmitter<string>();

  public init = 0;
  public stepsStatusComment: string;
  public previousValueStatus;
  public addCommentStepStatus = true;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      const changeStep: SimpleChange = changes.step;
      const changeStatus: SimpleChange = changes.status;
      this.previousValueStatus = changeStatus.previousValue;
      console.log(changeStep);
      console.log(changeStatus);
      if (this.init) { // ne se lance pas à l'initialisation du composant
        if (changeStatus.currentValue === 3) {
          console.log(this.allFichesMateriel.length);
          console.log(this.newObject.IdStatutElementsAnnexes);
          console.log(this.newObject.Renouvellement);
          console.log(this.newObject.DateAcceptation);
          if (
            this.allFichesMateriel.length === 1 &&
            (this.newObject.IdStatutElementsAnnexes !== 3 ||
            (this.newObject.Renouvellement === 1 &&
            this.newObject.DateAcceptation !== null) ||
            ((this.newObject.Renouvellement === 0 || this.newObject.Renouvellement === null) &&
            this.newObject.DateAcceptation === null))
          ) {
            this.openWarningSwal();
          } else if (this.allFichesMateriel.length > 1) {
            const arrayIdStatutElementsAnnexes = [];
            const arrayRenouvellementDateAcceptation = [];
            const arrayDateAcceptation = [];
            this.allFichesMateriel.forEach(item => {
              if (item.IdStatutElementsAnnexes === 3 ) {
                arrayIdStatutElementsAnnexes.push(item);
              } // A CHANGER A PARTIR DE LA :
              if ((item.Renouvellement && item.DateAcceptation !== null) || (!item.Renouvellement && item.DateAcceptation === null)) {
                arrayRenouvellementDateAcceptation.push(item);
              }
            });
            if (arrayIdStatutElementsAnnexes.length || arrayRenouvellementDateAcceptation) {
              this.openWarningSwal();
            }
          } else {
            this.openCommentSwal();
          }
        } else {
          if (this.addCommentStepStatus) {
            this.openCommentSwal();
          }
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
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider',
      confirmButtonColor: 'rgb(23, 170, 178)',
    }).then((result) => {
      if (result.value) {
        this.stepsStatusComment = result.value;
        this.onCommentChange(result.value);
        console.log(this.stepsStatusComment);
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
    });
  }

}
