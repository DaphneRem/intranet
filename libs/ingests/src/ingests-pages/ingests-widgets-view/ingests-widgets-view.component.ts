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
      color: 'linear-gradient(45deg, #4099ff, #73b4ff)'
    },
    {
      title: 'Terminés',
      icon: 'icofont icofont-check-alt',
      size: 'col-md-12 col-lg-6 ',
      link: './completed',
      color: 'linear-gradient(45deg, #2ed8b6, #59e0c5)'
    },
    {
      title: 'En attente KAI',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './kai-waiting',
      color: 'linear-gradient(45deg, #FF5370, #ff869a)'
    },
    {
      title: 'En attente KARINA',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './karina-waiting',
      color: 'linear-gradient(45deg, #FFB64D, #ffcb80)'
    }
  ];

  // http://icofont.com/icons/

  ngOnInit() {
  }

}
