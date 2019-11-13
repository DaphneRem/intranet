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
  @Output() lastStep = new EventEmitter<number>();
  @Output() newComment = new EventEmitter<string>();

  @Output() backToOldStepStatus = new EventEmitter<string>();

  public init = 0;
  public firstChangeStep = 0;
  public stepsStatusComment: string;
  public previousValueStatus;
  public previousValueStep;
  public addCommentStepStatus = true;
  public openWarningSwalModal = false;
  public changeStatus: boolean = false;
  public changeStep: boolean = false;
  public lastChangeIsStep: boolean = false;
  public lastChangeIsStatus: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes from status-step-comment-modal => ', changes);
    console.log('INIT => ', this.init);
    if ((changes.status) && (changes.status)) {
      // console.log('change STEP + STATUS');
      if (typeof changes.status.currentValue !== 'undefined') {
        this.changeStatus = true;
        this.lastChangeIsStep = false;
      }
      this.lastChangeIsStatus = true;
      const changeStatus: SimpleChange = changes.status;
      // console.log(changes.status.firstChange);
      if (typeof changeStatus.previousValue !== 'undefined') {
        console.log('change status => ', changes);
        console.log('this.previousValueStatus => ', this.previousValueStatus);
        this.previousValueStatus = changeStatus.previousValue;
      }
      if (this.init > 0) {
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
    } else if ((changes.step) && (!changes.status) && (this.init > 0)) {
      console.log(changes.status);
      console.log('this.addCommentStepStatus => ', this.addCommentStepStatus);
      if (!changes.status) {
        this.firstChangeStep++;
        this.changeStep = true;
        this.lastChangeIsStep = true;
        // console.log('change STEP');
        const changeStep: SimpleChange = changes.step;
        // console.log(changes.step.firstChange);
        if (typeof changeStep.previousValue !== 'undefined') {
          console.log('changeStep.previousValue => ', changeStep.previousValue);
          console.log('changes => ', changes);
          console.log('this.previousValueStatusfrom step change => ', this.previousValueStatus);
          this.previousValueStep = changeStep.previousValue;
          // if (typeof this.previousValueStatus === 'undefined') {
          //   this.previousValueStatus = this.status;
          //   console.log('this.previousValueStatus after change from step change => ', this.previousValueStatus);
          // }
        }
        // console.log(changeStep);
        if (this.init && !this.openWarningSwalModal) {
          this.openCommentSwal();
          console.log('add comment');
          // if (!this.onlyChangeStep) {
          //   this.openCommentSwal();
          //   this.onlyChangeStep = true;
          // }
        }
        this.init++;
        // this.addCommentStepStatus = true;
      }
    } else if ((changes.step) && (changes.status) && (this.init > 0)) {
      alert('all change');
    } else if ((changes.step) && (!changes.status) && (this.init === 0)) {
      console.log('first change step with init === 0');
      // this.onlyChangeStep = true;
      // this.changeStep = true;
      this.init++;
      // this.openCommentSwal();
    }

    this.init++;
    this.addCommentStepStatus = true;
  }
  public onlyChangeStep = false;

  onCommentChange(comment: string) {
    this.newComment.emit(comment);
  }

  onStatusChange(lastValueStatus: string) {
    this.lastStatus.emit(lastValueStatus);
  }

  onStepChange(lastValueStep: number) {
    this.lastStep.emit(lastValueStep);
  }

  onBackToOldStepStatus(e: string) {
    this.backToOldStepStatus.emit(e);
  }

  openCommentSwal() {
    console.log('this.previousValueStep => ', this.previousValueStep);
    console.log('this.previousValueStatus => ', this.previousValueStatus);
    swal({
      title: 'Ajouter un commentaire pour Statuts/Etapes',
      // footer: `Statut ${this.status} et étape ${this.step} et ancien statut ${this.previousValueStatus} et étape ${this.previousValueStep}`,
      input: 'textarea',
      html: `<button id="backToOldValue" class="btn swal-btn-cancel" >Annuler</button>`,
      showCancelButton: true,
      cancelButtonText: 'Aucun commentaire',
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: true,
      confirmButtonText: 'Valider',
      confirmButtonColor: 'rgb(23, 170, 178)',
      onBeforeOpen: () => {
        const content = swal.getContent();
        const $ = content.querySelector.bind(content);
        const backToOldValue = $('#backToOldValue');
        backToOldValue.addEventListener('click', () => {
          // this.lastStep.emit(this.previousValueStep);
          // this.previousValueStep = undefined;
          // this.previousValueStatus = undefined;
          // this.addCommentStepStatus = false;
          // this.openWarningSwalModal = false;
          // this.lastStatus.emit(this.previousValueStatus);
          console.log('this.changeStatus ==> ', this.changeStatus);
          console.log('this.changeStep ==> ', this.changeStep);
          if (this.changeStatus) {
            console.log('event send is status');
            this.backToOldStepStatus.emit('status');
            this.init = 0;
          } else if (!this.changeStatus && this.changeStep) {
            console.log('event send is step');
            this.backToOldStepStatus.emit('step');
            if (this.lastChangeIsStep) {
              console.log('last change is step => ', this.lastChangeIsStep);
              this.init = 0;
            } else {
              console.log('last change is !step => ', this.lastChangeIsStep);
              this.init = 0;
            }
          }
          console.log('last change is step ===> ', this.lastChangeIsStep);
          // let resetComment = '';
          // this.onCommentChange(resetComment);
          // swal.close();
          this.changeStatus = false;
          this.changeStep = false;
          swal.close();
          if (this.firstChangeStep === 1) {

          }
        });
      }
    }).then((result) => {
      console.log('result swal modal => ', result);
      if (result.value) {
        this.init = 0;
        this.stepsStatusComment = result.value;
        this.onCommentChange(result.value);
        this.previousValueStep = undefined;
        this.previousValueStatus = undefined;
        this.changeStatus = false;
        this.changeStep = false;
        console.log(this.stepsStatusComment);
      } else if (result.dismiss) {
        this.changeStatus = false;
        this.changeStep = false;
        this.init = 0;
        console.log('swal result comment status-step => ', result);
        // this.lastStatus.emit(this.previousValueStatus);
        // this.lastStep.emit(this.previousValueStep);
        // this.previousValueStep = undefined;
        // this.previousValueStatus = undefined;
        // this.addCommentStepStatus = false;
        // this.openWarningSwalModal = false;
        // this.lastStatus.emit(this.previousValueStatus);
        let resetComment = '';
        this.onCommentChange(resetComment);
      }
    });
  }

  openWarningSwal() {
    swal({
      type: 'error',
      text:
        `Pour changer le statut en « Accepté »,
        les éléments annexes doivent être marqués comme traités et une date
        d’acceptation doit être renseignée (si différent de renouvellement).
        Vérifiez que ces conditions soient remplies et réessayez.`,
      confirmButtonColor: 'rgb(23, 170, 178)',
    }).then((result) => {
      this.onStatusChange(this.previousValueStatus);
      this.init = -1;
      this.addCommentStepStatus = false;
      this.openWarningSwalModal = false;
      this.previousValueStep = undefined;
      this.previousValueStatus = undefined;
      this.changeStatus = false;
      this.changeStep = false;
      // this.init = 0;
    });
  }

}




// import {
//   Component,
//   OnInit,
//   Input,
//   Output,
//   OnChanges,
//   SimpleChanges,
//   SimpleChange,
//   ViewChild,
//   EventEmitter
// } from '@angular/core';
// import swal from 'sweetalert2';

// @Component({
//   selector: 'steps-status-comment-modal',
//   templateUrl: './steps-status-comment-modal.component.html',
//   styleUrls: ['./steps-status-comment-modal.component.scss']
// })
// export class StepsStatusCommentModalComponent implements OnInit, OnChanges {
//   @Input() selectionType;
//   @Input() step;
//   @Input() status;
//   @Input() newObject;
//   @Input() allFichesMateriel;
//   @Input() valueNotToChangeLibelle;

//   @Output() lastStatus = new EventEmitter<string>();
//   @Output() lastStep = new EventEmitter<number>();
//   @Output() newComment = new EventEmitter<string>();

//   @Output() backToOldStepStatus = new EventEmitter<string>();

//   public init = 0;
//   public firstChangeStep = 0;
//   public stepsStatusComment: string;
//   public previousValueStatus;
//   public previousValueStep;
//   public addCommentStepStatus = true;
//   public openWarningSwalModal = false;
//   public changeStatus: boolean = false;
//   public changeStep: boolean = false;
//   public lastChangeIsStep: boolean = false;
//   public lastChangeIsStatus: boolean = false;

//   constructor() { }

//   ngOnInit() {
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     console.log('changes from status-step-comment-modal => ', changes);
//     console.log('INIT => ', this.init);
//     if ((changes.status) && (changes.status)) {
//       // console.log('change STEP + STATUS');
//       if (typeof changes.status.currentValue !== 'undefined') {
//         this.changeStatus = true;
//         this.lastChangeIsStep = false;
//       }
//       this.lastChangeIsStatus = true;
//       const changeStatus: SimpleChange = changes.status;
//       // console.log(changes.status.firstChange);
//       if (typeof changeStatus.previousValue !== 'undefined') {
//         console.log('change status => ', changes);
//         console.log('this.previousValueStatus => ', this.previousValueStatus);
//         this.previousValueStatus = changeStatus.previousValue;
//       }
//       if (this.init > 0) {
//         // ne se lance pas à l'initialisation du composant
//         if (changeStatus.currentValue === 3) {
//           // console.log('change Statut current value => ', changeStatus.currentValue);
//           // console.log(this.allFichesMateriel.length);
//           // console.log(this.newObject.IdStatutElementsAnnexes);
//           // console.log(this.newObject.Renouvellement);
//           // console.log(typeof this.newObject.DateAcceptation);
//           // console.log(this.newObject.DateAcceptation);
//           // console.log(this.newObject.IdStatutElementsAnnexes);
//           let statusIsOk = false;
//           let renouvellementIsOk = false;
//           let dateAcceptationIsOk = false;
//           if (this.newObject.IdStatutElementsAnnexes === 3) {
//             statusIsOk = true;
//           } else {
//             statusIsOk = false;
//           }
//           if (
//               this.newObject.Renouvellement === this.valueNotToChangeLibelle
//               || this.newObject.Renouvellement === 0
//               || this.newObject.Renouvellement === null
//             ) {
//               renouvellementIsOk = false;
//             } else {
//               renouvellementIsOk = true;
//           }
//           if (
//               this.newObject.DateAcceptation === null
//               || this.newObject.DateAcceptation === this.valueNotToChangeLibelle
//               || this.newObject.DateAcceptation === 'dd-mm-yyyy'
//             ) {
//               dateAcceptationIsOk = false;
//             } else {
//               dateAcceptationIsOk = true;
//           }
//           // if (
//           //     (this.newObject.IdStatutElementsAnnexes !== 3)
//           //     || (
//           //         (this.newObject.Renouvellement === this.valueNotToChangeLibelle)
//           //         || (this.newObject.DateAcceptation === this.valueNotToChangeLibelle)
//           //         || (this.newObject.DateAcceptation === 'dd-mm-yyyy')
//           //       )
//           //     || (
//           //         (this.newObject.Renouvellement === 0 || this.newObject.Renouvellement === null)
//           //         && (this.newObject.DateAcceptation === null || this.newObject.DateAcceptation === 'dd-mm-yyyy' || this.newObject.DateAcceptation === this.valueNotToChangeLibelle)
//           //         )
//           //   ) {
//           // console.log('statusIsOk => ', statusIsOk);
//           // console.log('renouvellementIsOk => ', renouvellementIsOk);
//           // console.log('dateAcceptationIsOk => ', dateAcceptationIsOk);
//           if (!statusIsOk || (!renouvellementIsOk && !dateAcceptationIsOk)) {
//             // console.log('warning modal call');
//             this.openWarningSwalModal = true;
//             this.openWarningSwal();
//           // } else if (this.allFichesMateriel.length > 1) {
//           //   const arrayIdStatutElementsAnnexes = [];
//           //   const arrayRenouvellementDateAcceptation = [];
//           //   const arrayDateAcceptation = [];
//           //   this.allFichesMateriel.forEach(item => {
//           //     if (item.IdStatutElementsAnnexes === 3) {
//           //       arrayIdStatutElementsAnnexes.push(item);
//           //     } // A CHANGER A PARTIR DE LA :
//           //     if ((item.Renouvellement && item.DateAcceptation !== null) || (!item.Renouvellement && item.DateAcceptation === null)) {
//           //       arrayRenouvellementDateAcceptation.push(item);
//           //     }
//           //   });
//           //   if (arrayIdStatutElementsAnnexes.length || arrayRenouvellementDateAcceptation) {
//           //     this.openWarningSwal();
//           //   }
//           } else {
//             // console.log('!openswalWArning : all options are good for comment');
//             this.openCommentSwal();
//           }
//         } else {
//           if (this.addCommentStepStatus) {
//             // console.log('add comment statut without change step');
//             if (this.init > 1 && this.selectionType === 'multi') {
//               this.openCommentSwal();
//             } else if (this.selectionType !== 'multi') {
//               this.openCommentSwal();
//             }
//           }
//         }
//       } 
//       // this.init++;
//       // this.addCommentStepStatus = true;
//     } else if ((changes.step) && (!changes.status) && (this.changeStatus === false) && (this.init > 0)) {
//       console.log(changes.status);
//       console.log('this.addCommentStepStatus => ', this.addCommentStepStatus);
//       if (!changes.status) {
//         this.firstChangeStep++;
//         this.changeStep = true;
//         this.lastChangeIsStep = true;
//         // console.log('change STEP');
//         const changeStep: SimpleChange = changes.step;
//         // console.log(changes.step.firstChange);
//         if (typeof changeStep.previousValue !== 'undefined') {
//           console.log('changeStep.previousValue => ', changeStep.previousValue);
//           console.log('changes => ', changes);
//           console.log('this.previousValueStatusfrom step change => ', this.previousValueStatus);
//           this.previousValueStep = changeStep.previousValue;
//           // if (typeof this.previousValueStatus === 'undefined') {
//           //   this.previousValueStatus = this.status;
//           //   console.log('this.previousValueStatus after change from step change => ', this.previousValueStatus);
//           // }
//         }
//         // console.log(changeStep);
//         if (this.init && !this.openWarningSwalModal) {
//           this.openCommentSwal();
//           console.log('add comment');
//           // if (!this.onlyChangeStep) {
//           //   this.openCommentSwal();
//           //   this.onlyChangeStep = true;
//           // }
//         }
//         this.init++;
//         // this.addCommentStepStatus = true;
//       }
//     } else if ((changes.step) && (changes.status) && (this.init > 0)) {
//       alert('all change');
//     } else if ((changes.step) && (!changes.status) && (this.init === 0) && (this.changeStatus === false)) {
//       console.log('first change step with init === 0');
//       // this.onlyChangeStep = true;
//       console.log('this.changeStatus => ', this.changeStatus);
//       this.changeStep = true;
//       this.init++;
//       // this.openCommentSwal();
//     }
//     if (this.init === 0) {
//       this.changeStatus = false;
//       this.changeStep = false;
//     }
//     this.init++;
//     this.addCommentStepStatus = true;
//   }
//   public onlyChangeStep = false;

//   onCommentChange(comment: string) {
//     this.newComment.emit(comment);
//     this.init = 0;
//   }

//   onStatusChange(lastValueStatus: string) {
//     this.lastStatus.emit(lastValueStatus);
//   }

//   onStepChange(lastValueStep: number) {
//     this.lastStep.emit(lastValueStep);
//   }

//   onBackToOldStepStatus(e: string) {
//     this.backToOldStepStatus.emit(e);
//   }

//   openCommentSwal() {
//     console.log('this.previousValueStep => ', this.previousValueStep);
//     console.log('this.previousValueStatus => ', this.previousValueStatus);
//     swal({
//       title: 'Ajouter un commentaire pour Statuts/Etapes',
//       // footer: `Statut ${this.status} et étape ${this.step} et ancien statut ${this.previousValueStatus} et étape ${this.previousValueStep}`,
//       input: 'textarea',
//       html: `<button id="backToOldValue" class="btn swal-btn-cancel" >Annuler</button>`,
//       showCancelButton: true,
//       cancelButtonText: 'Aucun commentaire',
//       allowOutsideClick : false,
//       allowEscapeKey: false,
//       reverseButtons: true,
//       confirmButtonText: 'Valider',
//       confirmButtonColor: 'rgb(23, 170, 178)',
//       cancelButtonColor: 'rgb(23, 170, 178)',
//       onBeforeOpen: () => {
//         const content = swal.getContent();
//         const $ = content.querySelector.bind(content);
//         const backToOldValue = $('#backToOldValue');
//         backToOldValue.addEventListener('click', () => {
//           // this.lastStep.emit(this.previousValueStep);
//           // this.previousValueStep = undefined;
//           // this.previousValueStatus = undefined;
//           // this.addCommentStepStatus = false;
//           // this.openWarningSwalModal = false;
//           // this.lastStatus.emit(this.previousValueStatus);
//           console.log('CLICK ANNULER BTN');
//           console.log('this.changeStatus ==> ', this.changeStatus);
//           console.log('this.changeStep ==> ', this.changeStep);
//           if (this.changeStatus) {
//             console.log('event send is status');
//             this.backToOldStepStatus.emit('status');
//             this.init = 0;
//           } else if (!this.changeStatus && this.changeStep) {
//             console.log('event send is step');
//             this.backToOldStepStatus.emit('step');
//             if (this.lastChangeIsStep) {
//               console.log('last change is step => ', this.lastChangeIsStep);
//               this.init = 0;
//             } else {
//               console.log('last change is !step => ', this.lastChangeIsStep);
//               this.init = 0;
//             }
//           }
//           console.log('last change is step ===> ', this.lastChangeIsStep);
//           // let resetComment = '';
//           // this.onCommentChange(resetComment);
//           // swal.close();
//           this.changeStatus = false;
//           this.changeStep = false;
//           swal.close();
//           if (this.firstChangeStep === 1) {

//           }
//         });
//       }
//     }).then((result) => {
//       console.log('result swal modal => ', result);
//       if (result.value || result.value === '') {
//         console.log('CLICK VALIDER BTN');
//         this.stepsStatusComment = result.value;
//         this.onCommentChange(result.value);
//         this.previousValueStep = undefined;
//         this.previousValueStatus = undefined;
//         this.changeStatus = false;
//         this.changeStep = false;
//         console.log('init before validation => ', this.init);
//         this.init = 0;
//         console.log('init after validation => ', this.init);
//         console.log('this.stepsStatusComment => ', this.stepsStatusComment);
//       } else if (result.dismiss) {
//         console.log('CLICK AUCUN COMMENTAIRE BTN');
//         this.changeStatus = false;
//         this.changeStep = false;
//         console.log('swal result comment status-step => ', result);
//         // this.lastStatus.emit(this.previousValueStatus);
//         // this.lastStep.emit(this.previousValueStep);
//         // this.previousValueStep = undefined;
//         // this.previousValueStatus = undefined;
//         // this.addCommentStepStatus = false;
//         // this.openWarningSwalModal = false;
//         // this.lastStatus.emit(this.previousValueStatus);
//         let resetComment = '';
//         this.onCommentChange(resetComment);
//       }
//     });
//   }

//   openWarningSwal() {
//     swal({
//       type: 'error',
//       text:
//       `Pour changer le statut en « Accepté »,
//         les éléments annexes doivent être marqués comme traités et une date
//         d’acceptation doit être renseignée (si différent de renouvellement).
//         Vérifiez que ces conditions soient remplies et réessayez.`,
//       confirmButtonColor: 'rgb(23, 170, 178)',
//     }).then((result) => {
//       this.onStatusChange(this.previousValueStatus);
//       // this.init = -1;
//       this.addCommentStepStatus = false;
//       this.openWarningSwalModal = false;
//       this.previousValueStep = undefined;
//       this.previousValueStatus = undefined;
//       this.changeStatus = false;
//       this.changeStep = false;
//       this.init = 0;
//     });
//   }

// }
