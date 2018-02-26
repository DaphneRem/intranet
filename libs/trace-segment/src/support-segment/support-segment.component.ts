import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'support-segment',
  templateUrl: './support-segment.component.html',
  styleUrls: ['./support-segment.component.scss']
})
export class SupportSegmentComponent implements OnInit {
  @Input() data;
  title;
  widgetBlue = 'rgb(64, 153, 255)';
  widgetYellow = '#FFB64D';
  widgetGrenn = '#06DEC0';

  widgetsData: any;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    this.displayWidgetData(this.data);
  }

  displayWidgetData(data) {
  this.widgetsData = [
    {
      headerTitle : `Support ${data.StatutSupport}`,
      headerColor : this.widgetGrenn,
      rows : [
        {
          title: 'Numéro',
          data : data.id
        },
        {
          title: 'Type',
          data: data.TypeSupport
        },
        {
          title: 'Format',
          data: data.Formatsupport
        }
      ]
    },
    {
      headerTitle : 'Diffusion',
      headerColor : this.widgetYellow,
      rows : [
        {
          title: 'Chaîne',
          data : '...'
        },
        {
          title: 'Date de diffusion',
          data: '...'
        },
        {
          title: 'Heure de diffusion',
          data: '...'
        }
      ]
    },
    {
      headerTitle : 'Description',
      headerColor : this.widgetBlue,
      rows : [
        {
          title: 'Programme',
          data : data.numprogram
        },
        {
          title: 'Episode',
          data: data.numepisode
        },
        {
          title: 'Durée',
          data: data.durant
        }
      ]
    },
    {
      headerTitle : 'Création / Suivi',
      headerColor : this.widgetBlue,
      rows : [
        {
          title: 'Création',
          data : data.datecre
        },
        {
          title: 'Mise à jour',
          data: data.datemaj
        },
        {
          title: 'Mise à jour faite par',
          data: data.usermaj
        }
      ]
    },
    {
      headerTitle : 'TC',
      headerColor : this.widgetBlue,
      rows : [
        {
          title: 'TC de début',
          data : data.markin
        },
        {
          title: 'TC de fin',
          data: data.markout
        }
      ]
    },
    {
      headerTitle : 'Autres informations',
      headerColor : this.widgetBlue,
      rows : [
        {
          title: 'Numéro de diffusion',
          data : data.diffusionid
        },
        {
          title: 'Identifiant SGT',
          data: data.objid
        }
      ]
    }
   ];
  }

}
