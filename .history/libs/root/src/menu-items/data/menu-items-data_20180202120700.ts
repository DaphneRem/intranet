const distUrl = 'http://127.0.0.1/edsa-Angular/ng-nx-project/dist/apps/';

export const MENUITEMS = [
    {
        label: 'App0',
        url: `${this.distUrl}app0/`,
        main: [
            {
                state: 'technique',
                short_label: 'T',
                name: 'Technique',
                type: 'sub',
                icon: 'icon-home',
                children: [
                    {
                        state: 'numerisation',
                        name: 'Numérisation',
                        routerLink: 'scan'
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier',
                        routerLink: 'detail-file'

                    },
                    {
                        state: 'fichiers-purges',
                        name: 'Fichiers Purgés',
                        routerLink: 'purged'
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
