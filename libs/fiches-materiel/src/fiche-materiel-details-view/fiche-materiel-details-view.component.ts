import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'fiche-materiel-details-view',
  templateUrl: './fiche-materiel-details-view.component.html',
  styleUrls: [
    './fiche-materiel-details-view.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    FichesAchatService,
    FichesMaterielService
  ]
})
export class FicheMaterielDetailsViewComponent implements OnInit {

  public sub;
  public idParamsFicheMateriel;
  public idParamsFicheAchat;
  public ficheAchatDetails;
  public myFicheAchatGlobal;
  public myFicheAchatDetails;
  public myFicheMateriel;
  public dataMaterielReady = false;
  public dataGloralReady = false;
  public dataDetailsReady = false;

  public icons: CustomIconBadge[];
  public fichesMaterielModification: CustomIconBadge = {
    littleIcon: {
      circleColor: '#FF9C2A',
      icon: 'icofont icofont-pencil',
      iconSize: '1.6em',
      iconMargin: '2px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
    },
    link: '/creation',
    tooltip : true,
    tooltipMessage : 'Modifier la fiche Matériel'
  };

  public fichesAchatView: CustomIconBadge = {
      littleIcon : {
        circleColor: '#3383FF',
        icon : 'icofont icofont-eye',
        iconSize: '1.5em',
        iconMargin: '2px',
      },
      bigIcon : {
        icon: 'icofont icofont-tag',
        circleColor: '#999898',
        circleColorHover: '#b5b3b3',
      },
      action : () => alert('salut'),
      tooltip : true,
      tooltipMessage : 'Voir la fiche Achat associée'
  };

  public back: CustomIconBadge = {
      bigIcon : {
        icon: 'icofont icofont-exit',
        circleColor: '#17AAB2',
        circleColorHover: '#2eced6',
        iconSize: '2.2em'
      },
      link : '../../../0/desc',
      tooltip : true,
      tooltipMessage : 'Retour aux fiches Matériel'
  };
  constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fichesAchatService: FichesAchatService,
        private fichesMaterielService: FichesMaterielService

  ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielModification, this.fichesAchatView, this.back];
    this.sub = this.route.params.subscribe(params => {
      this.idParamsFicheMateriel = +params['idFicheMateriel'];
      this.idParamsFicheAchat = +params['idFicheAchatDetails'];
      console.log(this.idParamsFicheAchat);
      console.log(this.idParamsFicheMateriel);
    });
    this.getFicheAchatDetails(this.idParamsFicheAchat);
    this.getFicheAchatGlobal(this.idParamsFicheAchat);
    this.getFicheMateriel(this.idParamsFicheMateriel);
  }

  getFicheMateriel(id: number) {
    this.fichesMaterielService
      .getOneFicheMateriel(id)
      .subscribe(data => {
        console.log(data);
        this.myFicheMateriel = data;
        this.dataMaterielReady = true;
      });
  }


  getFicheAchatDetails(id: number) {
    this.fichesAchatService
    .getFichesAchatDetails(id)
      .subscribe(data => {
        console.log(data);
        if (data !== null) {
          this.myFicheAchatDetails = data;
          this.dataDetailsReady = true;
        } else {
          this.myFicheAchatDetails = {};
          this.dataDetailsReady = true;
        }
        console.log(this.myFicheAchatDetails);
      });
  }

  getFicheAchatGlobal(id: number) {
    this.fichesAchatService
    .getGlobalFIcheAchat(id)
    .subscribe(data => {
        console.log(data);
        if (data !== null) {
          this.myFicheAchatGlobal = data;
          this.dataGloralReady = true;
        } else {
          this.myFicheAchatGlobal = {};
          this.dataGloralReady = true;
        }
        console.log(this.myFicheAchatGlobal);
      });
  }

}