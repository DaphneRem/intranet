import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pub-widgets-view',
  templateUrl: './pub-widgets-view.component.html',
  styleUrls: ['./pub-widgets-view.component.scss']
})
export class PubWidgetsViewComponent implements OnInit {

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
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
