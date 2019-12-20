
// TODO : ajouter url définitive de prod (importer à partir du fichier privates-url.ts)

import {
    rootUrlDiffDates,
    rootUrl,
    rootUrlMateriel,
    rootUrlKPlanner,
    buildModeFichesMaterielApp,
    buildModeKplannerApp
} from '../../../../../.privates-url';

let distUrl: String = '';
let distUrl_DiffDates: String = '';
let distUrl_Materiel: String = '';
let distUrl_KPlanner: String = '';

if (document.location.host.indexOf('localhost') !== -1) {
  distUrl =  '';
  distUrl_DiffDates = '#';
  distUrl_Materiel = '';
  distUrl_KPlanner = '';
} else {
  distUrl =  rootUrl + '/#';
  distUrl_DiffDates = rootUrlDiffDates + '/#';
  distUrl_Materiel = rootUrlMateriel + '/#';
  distUrl_KPlanner = rootUrlKPlanner + '/#';
}

let MENU = [];

if (buildModeFichesMaterielApp < 1 && buildModeKplannerApp <= 1) {
    MENU = [
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
                            tooltipText: 'Trace Segment'
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
                    icon: 'icofont icofont-file-text',
                    iconColor: '#FF9C2A',
                    children: [
                        {
                            state: 'suivi-fiches-materiel',
                            name: 'Suivi fiches Matériel',
                            route: `${distUrl_Materiel}/material-sheets`
                        },
                        {
                            state: 'creation-fiches-materiel',
                            name: 'Création fiches Matériel',
                            route: `${distUrl_Materiel}/creation`
                        },
                        {
                            state: 'suivi-fiches-achat',
                            name: 'Suivi fiches Achat',
                            route: `${distUrl_Materiel}/displaying-purchase-sheets`
                        }
                    ]
                },
                {
                    state: 'k-planner',
                    short_label: 'KP',
                    name: 'K Planner',
                    type: 'sub',
                    icon: 'icofont icofont-ui-calendar',
                    iconColor: '#DE5768',
                    children: [
                        {
                            state: 'Voir mon planning',
                            name: 'Voir mon planning',
                            route: `${distUrl_KPlanner}/k-planner`
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
} else {
    if (buildModeFichesMaterielApp > 1) {
    MENU = [
        {
            label: '',
            url: `${this.distUrl}app0/`,
            main: [
                {
                    state: 'fiches-materiel',
                    short_label: 'FM',
                    name: 'Fiches Matériel',
                    type: 'sub',
                    icon: 'icofont icofont-file-text',
                    iconColor: '#FF9C2A',
                    children: [
                        {
                            state: 'suivi-fiches-materiel',
                            name: 'Suivi fiches Matériel',
                            route: `${distUrl_Materiel}/material-sheets`
                        },
                        {
                            state: 'creation-fiches-materiel',
                            name: 'Création fiches Matériel',
                            route: `${distUrl_Materiel}/creation`
                        },
                        {
                            state: 'suivi-fiches-achat',
                            name: 'Suivi fiches Achat',
                            route: `${distUrl_Materiel}/displaying-purchase-sheets`
                        }
                    ]
                }
            ]
        }
    ];
}
if (buildModeKplannerApp > 1) {
    MENU = [
        {
        label: '',
        url: `${this.distUrl}app0/`,
        main: [
                {
                    state: 'k-planner',
                    short_label: 'KP',
                    name: 'K Planner',
                    type: 'sub',
                    icon: 'icofont icofont-ui-calendar',
                    iconColor: '#DE5768',
                    children: [
                        {
                            state: 'Voir mon planning',
                            name: 'Voir mon planning',
                            route: `${distUrl_KPlanner}/k-planner`
                        }
                    ]
                }
            ]
        }
        ];

}
}

export const MENUITEMS = MENU;

