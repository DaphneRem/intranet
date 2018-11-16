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
      if (this.init && typeof changeDeliveryDate.currentValue !== 'string') {
        this.openSwal();
      }
      this.init++;
  }

  onCommentChange(comment: string) {
    this.newComment.emit(comment);
  }

  openSwal() {
    swal({
      title: 'Ajouter un commentaire',
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
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
