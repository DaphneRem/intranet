import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'liste-planning',
  templateUrl: './liste-planning.component.html',
  styleUrls: ['./liste-planning.component.scss']
})
export class ListePlanningComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  public planningListe: Object[] = [
    { Nom:"Voir autres plannings ", Id: 1 },
    { Nom:"Planning 1", Id: 2 },
    { Nom:"Planning 2", Id: 3 },
    { Nom:"Planning 3", Id: 4 },
    { Nom:"Planning 4", Id: 5 },
    { Nom:"Planning 5", Id: 6 },
];
}
