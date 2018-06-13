
// TODO : ajouter url définitive de prod (importer à partir du fichier privates-url.ts)

import { rootUrlDiffDates, rootUrl} from '../../../../../.privates-url';

let distUrl: String = '';
let distUrl_DiffDates: String = '';

if (document.location.host.indexOf('localhost') !== -1) {
  distUrl =  '';
  distUrl_DiffDates = '#';
} else {
  distUrl =  rootUrl + '/#';
  distUrl_DiffDates = rootUrlDiffDates + '/#';
}

export const MENUITEMS = [
    {
        label: 'Ingests',
        url: `${this.distUrl}app0/`,
        main: [
            {
                state: 'technique',
                short_label: 'T',
                name: 'Technique',
                type: 'sub',
                icon: 'icofont icofont-repair',
                iconColor: '#39ADB5',
                children: [
                    {
                        state: 'publicité',
                        name: 'Publicité',
                        route: `${distUrl}/advertising`
                    },
                    {
                        state: 'numerisation',
                        name: 'Numérisation',
                        route: `${distUrl}/ingests`
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier',
                        route: `${distUrl}/detail-file`,
                        tooltipText : 'Trace Segment'
                    },
                    {
                        state: 'fichiers-purges',
                        name: 'Fichiers Purgés',
                        route: `${distUrl}/purged`
                    },
                    {
                        state: 'playlists',
                        name: 'Playlists',
                        route: `${distUrl}/playlists`
                    }
                ]
            }
        ]
    },
    {
        label: 'Dates de diffusions',
        url: `${this.distUrl_DiffDates}diffusions-dates/`,
        main: [
            {
                state: 'Dates de diffusions',
                short_label: 'd',
                name: 'Dates de diffusions',
                type: 'sub',
                icon: 'icon-home',
                children: [
                    {
                      state: 'diffusions-dates',
                      name: 'Dates de diffusions',
                      route: `${distUrl_DiffDates}/diffusions-dates`
                    }
                ]
            }
        ]
    }
];
