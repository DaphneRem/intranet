import { Component, OnInit } from '@angular/core';

import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'display-fiches-achats',
  templateUrl: './display-fiches-achats.component.html',
  styleUrls: ['./display-fiches-achats.component.scss']
})
export class DisplayFichesAchatsComponent implements OnInit {

  public reloadData = false;
  public views = [
    {
      id: 0,
      label: 'Toutes'
    },
    {
      id: 1,
      label: 'Traitées'
    },
    {
      id: 2,
      label: 'Non traitées'
    }
  ];
  public selectedView;
  public stateFIcheAchat;
  public displayActionType = 'modal';
  public modalName = '#modal-detail-fiche-achat';
  public headerTableLinkExist = false;

  public icons = [];

  public fichesMaterielCreation: CustomIconBadge = {
    littleIcon: {
      circleColor: '#0EC93D',
      icon: 'icofont icofont-ui-add',
      iconSize: '1em',
      iconMargin: '6px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
    },
    link: '/creation',
    tooltip : true,
    tooltipMessage : 'Créer des fiches Matériel'
  };

  public fichesMaterielView: CustomIconBadge = {
    littleIcon: {
      circleColor: '#3383FF',
      icon: 'icofont icofont-eye',
      iconSize: '1.5em',
      iconMargin: '2px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
    },
    link: '../material-sheets/my-material-sheets',
    tooltip : true,
    tooltipMessage : 'Voir les fiches Matériel'
  };

  constructor() {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesMaterielView];
    this.stateFIcheAchat = this.views[2];
    this.selectedView = this.views[2];
  }

  select(view) {
    this.selectedView = view;
    console.log(this.selectedView);
  }

  submitView() {
    console.log('click sur btn rechercher');
    this.stateFIcheAchat = this.selectedView;
  }

}
