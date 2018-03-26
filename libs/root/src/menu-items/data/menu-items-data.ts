// TODO : ajouter url définitive de prod (importer à partir du fichier privates-url.ts)
const distUrl = 'url prod';

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
                        route: 'publicity'
                    },
                    {
                        state: 'numerisation',
                        name: 'Numérisation',
                        route: 'ingests',
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier',
                        route: 'detail-file',
                        tooltipText : 'Trace Segment'
                    },
                    {
                        state: 'fichiers-purges',
                        name: 'Fichiers Purgés',
                        route: 'purged'
                    }
                ]
            }
        ]
    },
    {
        label: 'App1',
        url: `${this.distUrl}app1/`,
        main: [
            {
                state: 'menu lorem ipsum',
                short_label: 'm',
                name: 'Menu lorem ipsum',
                type: 'sub',
                icon: 'icon-home',
                children: [
                    {
                        state: 'm1',
                        name: 'Menu lorem ipsum1',
                        routerLink: 'xxx'
                    },
                    {
                        state: 'm2',
                        name: 'Menu lorem ipsum2',
                        routerLink: 'xxx'

                    },
                    {
                        state: 'm3',
                        name: 'Menu lorem ipsum3',
                        routerLink: 'xxx'
                    }
                ]
            }
        ]
    }
];
