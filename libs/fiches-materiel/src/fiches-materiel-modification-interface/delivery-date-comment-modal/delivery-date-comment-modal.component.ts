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
    setTimeout(() => {
      if (this.livraisonIsValid) {
        if (changeDeliveryDate) {
          if ((this.init > 0) && (typeof changeDeliveryDate.currentValue === 'string') && (typeof changeDeliveryDate.previousValue === 'object')) {
            this.init = -1;
          } else if (this.init && (typeof changeDeliveryDate.currentValue !== 'string')) {
            this.openSwal();
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
    swal({
      title: 'Ajouter un commentaire : Date de livraison',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'Aucun commentaire',
      confirmButtonText: 'Valider',
      confirmButtonColor: 'rgb(23, 170, 178)',
    }).then((result) => {
      if (result.value) {
        this.deliveryComment = result.value;
        this.onCommentChange(result.value);
        console.log(this.deliveryComment);
      }
    });
  }

}
