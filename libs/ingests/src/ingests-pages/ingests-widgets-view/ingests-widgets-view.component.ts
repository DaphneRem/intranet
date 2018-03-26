import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ingests-widgets-view',
  templateUrl: './ingests-widgets-view.component.html',
  styleUrls: ['./ingests-widgets-view.component.scss']
})
export class IngestsWidgetsViewComponent implements OnInit {
  constructor() {}

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
      color: '#39ADB5'
    },
    {
      title: 'Terminés',
      icon: 'icofont icofont-check-alt',
      size: 'col-md-12 col-lg-6 ',
      link: './completed',
      color: '#17B978'
    },
    {
      title: 'En attente KAI',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './kai-waiting',
      color: '#FF5F5F'
    },
    {
      title: 'En attente KARINA',
      icon: 'icofont icofont-wall-clock',
      size: 'col-md-12 col-lg-6 ',
      link: './karina-waiting',
      color: '#FDB44B'
    }
  ];

  ngOnInit() {}
}