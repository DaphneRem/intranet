import { Component, OnInit, Input } from '@angular/core';

import { InformationsKai } from '../models/informations-kai';
import { InfoTraitementKai } from '../models/info-traitement-kai';

import { InformationsKaiService } from '../services/informations-kai.service';
import { InfoTraitementKaiService } from '../services/info-traitement-kai.service';

@Component({
  selector: 'info-traitemant-kai',
  templateUrl: './info-traitemant-kai.component.html',
  styleUrls: [
    './info-traitemant-kai.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
        InformationsKaiService,
        InfoTraitementKaiService
  ]
})
export class InfoTraitemantKaiComponent implements OnInit {
  @Input() file;
  public dataInfoReady = false;
  public dataTraitementReady = false;
  public infosKaiData: InformationsKai;
  public traitementKaiData: InfoTraitementKai;
  public widgetsInfosData;
  public widgetTraitementData;
  public minHeight = 155;
  public errorTraitement = false;
  public errorInfos = false;
  public errorMessage = 'Données indisponibles';

  constructor(
      private informationsKaiService: InformationsKaiService,
      private infoTraitementKaiService: InfoTraitementKaiService
  ) { }

  ngOnInit() {
    console.log(this.file);
    this.getInformationsKai();
  }

  getInformationsKai(): void {
    this.informationsKaiService
      .getInformationsKai(this.file.idSupport, this.file.numSegment)
      .subscribe(data => {
        this.infosKaiData = data;
        if (!data) {
          this.errorInfos = true;
        }
        this.displayInfosWidgets();
        this.getInfoTraitementKai();
      });
  }

  getInfoTraitementKai() {
    this.infoTraitementKaiService
      .getInfoTraitementKai(this.file.idSupport, this.file.numSegment)
      .subscribe(data => {
        this.traitementKaiData = data;
        if (!data) {
          this.errorTraitement = true;
        }
        this.displayTraitementWidgets();
      });
  }

  displayInfosWidgets() {
    this.widgetsInfosData = [
      {
        headerTitle : 'SGT',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Identifiant SGT (obj id)',
            data : this.infosKaiData.ObectId,
          },
          {
            title: 'Statut SGT',
            data: this.infosKaiData.Status,
          }
        ]
      },
      {
        headerTitle : 'Informations KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        icon : 'info-square',
        size : 3,
        rows : [
          {
            title: 'Unité de stockage',
            data: this.infosKaiData.objgroup,
          },
          {
            title: 'Statut du fichier',
            data: this.infosKaiData.technicalStatus,
          },
          {
            title: 'Date de mise à jour',
            data: this.infosKaiData.datemaj,
            type: 'date'
          },
        ]
      }
    ];
    this.dataInfoReady = true;
  }

  displayTraitementWidgets() {
    this.widgetTraitementData = [
       {
        headerTitle : 'Traitement KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Etape',
            data: this.traitementKaiData.statut,
          },
          {
            title: 'Statut',
            data: this.traitementKaiData.posstatut,
          },
        ]
      },
      {
        headerTitle : 'Commentaire KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Commentaire',
            data: this.traitementKaiData.commentaire,
          },
        ]
      },
    ];
    this.dataTraitementReady = true;
  }

}
