import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-widgets-view',
  templateUrl: './ingests-widgets-view.component.html',
  styleUrls: ['./ingests-widgets-view.component.scss']

})
export class IngestsWidgetsViewComponent implements OnInit {

  constructor() {

    // this.tableViewStore = this.store;
  }

  public view;
  public tableViewStore;
  public tableViewState;
  public link = './tables-view';
  public widgets: any = [
    {
      title: 'En cours de traitement',
      icon: 'icofont icofont-spinner-alt-6',
      size: 'col-md-12 col-lg-6 ',
      link: './in-progress',
      color: '#3498DB'
    },
    {
      title: 'Terminés',
      icon: 'icofont icofont-check-alt',
      size: 'col-md-12 col-lg-6 ',
      link: './completed',
      color: '#2ECC71'
    },
    {
      title: 'En attente KAI',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './kai-waiting',
      color: '#E74C3C'
    },
    {
      title: 'En attente KARINA',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './karina-waiting',
      color: '#F1C40F'
    }
  ];

  // http://icofont.com/icons/

  ngOnInit() {
  }

}
