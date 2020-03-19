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
import { mainColor, maintColorHover } from '../../../fiches-materiel-common-theme';

@Component({
  selector: 'delivery-date-comment-modal',
  templateUrl: './delivery-date-comment-modal.component.html',
  styleUrls: [
    './delivery-date-comment-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class DeliveryDateCommentModalComponent implements OnInit, OnChanges {
  @Input() deliveryDate;
  @Input() livraisonIsValid;
  @Input() selectionType;
  @Output() newComment = new EventEmitter<string>();

  @ViewChild('commentDeliveryDate') modalTemplate;

  public init = 0;
  public deliveryComment: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const changeDeliveryDate: SimpleChange = changes.deliveryDate;
    console.log(changeDeliveryDate);
    console.log(changes);
    console.log(typeof changeDeliveryDate.currentValue);
    console.log('this.livraisonIsValid => ', this.livraisonIsValid);
    console.log('this.intit in deliveryDate => ', this.init);
    setTimeout(() => {
      if (this.livraisonIsValid) {
        if (changeDeliveryDate) {
          if ((this.init > 0) && (typeof changeDeliveryDate.currentValue === 'string') && (typeof changeDeliveryDate.previousValue === 'object')) {
            this.init = -1;
          } else if (this.init && (typeof changeDeliveryDate.currentValue !== 'string')) {
            console.log('openSwal in delivery date. this.intit = >', this.init);
            if (this.selectionType === 'multi') {
              this.openSwal();
            } else if (this.selectionType !== 'multi') {
              this.openSwal();
            }
          }
          this.init++;
        }
      }
    }, 1000);

  }

  onCommentChange(comment: string) {
    this.newComment.emit(comment);
  }

  openSwal() {
    console.log(this.init);
    swal({
      title: 'Ajouter un commentaire : Date de livraison',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'Aucun commentaire',
      cancelButtonColor: mainColor,
      confirmButtonText: 'Valider',
      confirmButtonColor: mainColor,
    }).then((result) => {
      if (result.value) {
        this.deliveryComment = result.value;
        this.onCommentChange(result.value);
        console.log(this.deliveryComment);
      }
    });
  }

}
