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
  selector: 'warning-accepted-status',
  templateUrl: './warning-accepted-status.component.html',
  styleUrls: ['./warning-accepted-status.component.scss']
})
export class WarningAcceptedStatusComponent implements OnInit, OnChanges {
  @Input() status;
  @Input() retourOri;
  @Input() allFichesMateriel;

  @Output() lastStatus = new EventEmitter<string>();

  public init = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      const changeStatus: SimpleChange = changes.status;
      const previousValueStatus = changeStatus.previousValue;
      console.log(changeStatus);
      console.log(changeStatus.currentValue);
      if (changeStatus.currentValue === 3 && this.init) {
          this.openSwal();
          this.onStatusChange(previousValueStatus);
      }
      this.init++;
  }

  onStatusChange(lastValueStatus: string) {
    this.lastStatus.emit(lastValueStatus);
  }

  openSwal() {
    swal({
      type: 'error',
      text:
      `Pour changer le statut en « Accepté »,
        les éléments annexes doivent être marqués comme traités et une date
        d’acceptation doit être renseignée (si différent de renouvellement).
        Vérifiez que ces conditions soient remplies et réessayez.`,
      confirmButtonColor: 'rgb(23, 170, 178)',
    });
  }


}
