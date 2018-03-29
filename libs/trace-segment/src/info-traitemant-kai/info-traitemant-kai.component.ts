import { Component, OnInit, Input } from '@angular/core';
import { InformationsKai } from '../models/informations-kai';
import { InformationsKaiService } from '../services/informations-kai.service';

@Component({
  selector: 'info-traitemant-kai',
  templateUrl: './info-traitemant-kai.component.html',
  styleUrls: [
    './info-traitemant-kai.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
        InformationsKaiService
  ]
})
export class InfoTraitemantKaiComponent implements OnInit {
  @Input() file;
  public dataReady = false;
  public infosKaiData;
  public widgetsInfosData;
  public minHeight = 155;
  public error;
  public errorMessage;

  constructor(
       private informationsKaiService: InformationsKaiService,

  ) { }

  ngOnInit() {
    console.log(this.file);
    this.getSupportSegment();
  }

  getSupportSegment(): void {
    this.informationsKaiService
      .getInformationsKai(this.file.idSupport, this.file.numSegment)
      .subscribe(data => {
        this.dataReady = true;
        this.infosKaiData = data;
        console.log(this.infosKaiData);
        if (!data) {
          this.error = true;
          this.errorMessage = 'Données indisponibles';
          console.log(this.error);
          console.log(this.errorMessage);
          this.displayErrorData();
        } else {
          this.displayWidgetInfosData(this.infosKaiData);
        }
      });
  }

  displayErrorData() {
    this.widgetsInfosData = [
      {
        headerTitle : 'SGT',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
      },
      {
        headerTitle : 'Informations KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        icon : 'info-square',
        size : 3,
      },
      // En attentant la requête informations traitement KAI
      {
        headerTitle : 'Traitement KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Etape', // STATUT
            data: 'REMONTEE INGEST',
          },
          {
            title: 'Statut', // posstatut
            data: 'TERMINE',
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
            title: 'Commentaire', // STATUT
            data: 'Il n\'y a pas d\'élément dans la liste des ordres: 20882848/0 (commentaire provisoire)',
          },
        ]
      },
    ];
  }

  displayWidgetInfosData(data) {
    this.widgetsInfosData = [
      {
        headerTitle : 'SGT',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Identifiant SGT',
            data : data.ObectId,
          },
          {
            title: 'Statut SGT',
            data: data.Status,
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
            data: data.objgroup,
          },
          {
            title: 'Statut du fichier',
            data: data.technicalStatus,
          },
          {
            title: 'Date de mise à jour',
            data: data.datemaj,
            type: 'date'
          },
        ]
      },
      // En attentant la requête informations traitement KAI
      {
        headerTitle : 'Traitement KAI',
        headerColor : 'red',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Etape', // STATUT
            data: 'REMONTEE INGEST',
          },
          {
            title: 'Statut', // posstatut
            data: 'TERMINE',
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
            title: 'Commentaire', // STATUT
            data: 'Il n\'y a pas d\'élément dans la liste des ordres: 20882848/0 (commentaire provisoire)',
          },
        ]
      },
    ];
  }

}
