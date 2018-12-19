import { Component, OnInit, Input } from '@angular/core';

import { SupportSegment } from '../models/support-segment';
import { SupportSegmentService } from '../services/support-segment.service';

@Component({
  selector: 'support-segment',
  templateUrl: './support-segment.component.html',
  styleUrls: [
    './support-segment.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    SupportSegmentService
  ]
})
export class SupportSegmentComponent implements OnInit {

  @Input() file; // recovers : file.idSupport, file.numSegment, file.exist and file.autoPath

  public widgetsData: any;
  public dataReady: boolean;
  public supportData; // recovers data from service

  public minHeight = 210; // min-height fo all widgets
  public error = {
    status : false,
    message: 'Les données sont momentanément indisponibles, veuillez essayer ultérieurement.'
  };

  constructor(private supportSegmentService: SupportSegmentService) {}

  ngOnInit() {
    this.getSupportSegment();
  }

  // get support-segment data from service
  getSupportSegment(): void {
    this.dataReady = false; // display loader
    this.supportSegmentService
      .getSupportSegment(this.file.idSupport, this.file.numSegment)
      .subscribe(
        (data) => {
          this.supportData = data ;
          this.dataReady = true; // pass to display without loeader
          this.displayWidgetData(this.supportData); // custom widgets data with result
        },
        (error) => { // if server issue
          this.error.status = true; // determines the display in html
          this.dataReady = true; // pass to display without loeader
          console.error(`Warning ! Error in Support-segment component : ${error}`); // dev can check issue in console
        }
      );
  }

  checkIconStatus(status): string {
    return (status === 'Exploitable') ? 'check-circled' :  'not-allowed';
  }

  checkColorStatus(status): string {
    return (status === 'Exploitable') ? 'valid' : 'invalid';
  }

  // customize data for widgets
  displayWidgetData(data): void {
    this.widgetsData = [
      {
        headerTitle : `Support ${data.StatutSupport}`,
        headerColor : 'navbar',
        icon : this.checkIconStatus(data.StatutSupport),
        iconColor : this.checkColorStatus(data.StatutSupport),
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Numéro',
            data : data.id,
            span : 'warning'
          },
          {
            title: 'Diffusion ID',
            data : data.diffusionid,
          },
          {
            title: 'Type',
            data: data.TypeSupport,
          },
          {
            title: 'Format',
            data: data.Formatsupport,
          }
        ]
      },
      {
        headerTitle : 'Description',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Programme',
            data : data.numprogram,
          },
          {
            title: 'Episode',
            data: data.numepisode,
          },
          {
            title: 'Type fichier',
            data: data.typefichier,
          }
        ]
      },
          {
        headerTitle : 'TC',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'TC de début',
            data : data.markin,
          },
          {
            title: 'TC de fin',
            data: data.markout,
          },
          {
            title: 'Durée',
            data: data.durant,
          }
        ]
      },
      {
        headerTitle : 'Création / Suivi',
        headerColor : 'navbar',
        minHeight : this.minHeight,
        size : 3,
        rows : [
          {
            title: 'Création',
            data :  data.datecre,
            type: 'date'
          },
          {
            title: 'Mise à jour',
            data:  data.datemaj,
            type: 'date'
          },
          {
            title: 'Mise à jour faite par',
            data: data.usermaj,
          }
        ]
      }
    ];
  }

}
