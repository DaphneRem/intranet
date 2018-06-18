
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
        label: '',
        url: `${this.distUrl}app0/`,
        main: [
            {
                state: 'suivi-ingests',
                short_label: 'SI',
                name: 'Suivi Ingests',
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
            },
            {
                state: 'fiches-materiel',
                short_label: 'FM',
                name: 'Fiches Matériel',
                type: 'sub',
                icon: 'icofont icofont-ui-file',
                iconColor: '#FF9C2A',
                children: [
                    {
                        state: 'suivi-fiches-materiel',
                        name: 'Suivi fiches Matériel',
                        route: `${distUrl}`
                    },
                    {
                        state: 'creation-fiches-materiel',
                        name: 'Création fiches Matériel',
                        route: `${distUrl}/creation`
                    },
                    {
                        state: 'suivi-fiches-achat',
                        name: 'Suivi fiches Achat',
                        route: `${distUrl}/display`
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
