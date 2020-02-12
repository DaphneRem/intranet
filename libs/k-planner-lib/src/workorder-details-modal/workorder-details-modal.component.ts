import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'workorder-details-modal',
  templateUrl: './workorder-details-modal.component.html',
  styleUrls: ['./workorder-details-modal.component.scss'],
})
export class WorkorderDetailsModalComponent {

  constructor(
    public dialogRef: MatDialogRef<WorkorderDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data
) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeDateFormat(date) {
    let newDate = new Date(date);
    return newDate;
  }

  close() {
    let containerModal = document.getElementsByClassName('cdk-overlay-container');
    console.log(containerModal);
    for (let i = 0; i < containerModal.length ; i++) {
      // containerModal[i].className += 'hidden';
      containerModal[i]['style'].display='none'
    }
  }

}
