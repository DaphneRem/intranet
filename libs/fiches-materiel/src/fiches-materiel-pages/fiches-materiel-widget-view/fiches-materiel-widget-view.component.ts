import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fiches-materiel-widget-view',
  templateUrl: './fiches-materiel-widget-view.component.html',
  styleUrls: ['./fiches-materiel-widget-view.component.scss']
})
export class FichesMaterielWidgetViewComponent implements OnInit {

  constructor() { }

  public tableView = false;
  public changeView = true;
  public link = './tables-view';
  public widgets: any = [
    {
      title: 'Mes Fiches Matériel en cours',
      icon: 'icofont icofont-spinner-alt-6',
      size: 'col-md-12 col-lg-6 ',
      link: './my-material-sheets/0/desc',
      color: '#39ADB5'
    },
    {
      title: 'Mes Fiches Matériel archivées',
      icon: 'icofont icofont-check-alt',
      size: 'col-md-12 col-lg-6 ',
      link: './all',
      color: '#17B978'
    },
    {
      title: 'Toutes mes Fiches Matériel',
      icon: 'icofont icofont-file-text',
      size: 'col-md-12 col-lg-6 ',
      link: './all',
      color: '#5ED4FF'
    },
    {
      title: 'Toutes les Fiches Matériel',
      icon: 'icofont icofont-file-text',
      size: 'col-md-12 col-lg-6 ',
      link: './all',
      color: '#1C2799'
    },
  ];

  ngOnInit() {
  }

}
