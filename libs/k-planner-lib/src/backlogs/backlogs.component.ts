import { Component, OnInit, ViewChild } from '@angular/core';
import { hospitalData, waitingList } from '../datasource';
import { HospitalData } from '../models/hospital-data';
import { extend, closest } from '@syncfusion/ej2-base';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { CellClickEventArgs, ResourceDetails, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'backlogs',
  templateUrl: './backlogs.component.html',
  styleUrls: ['./backlogs.component.scss']
})
export class BacklogsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public monteursListe: Object[] = [
    { Nom:"Voir autres monteurs ", Id: 1 },
    { Nom:"Monteur 1", Id: 2 },
    { Nom:"Monteur 2", Id: 3 },
    { Nom:"Monteur 3", Id: 4 },
    { Nom:"Monteur 4", Id: 5 },
    { Nom:"Monteur 5", Id: 6 },
];
}
