const distUrl = 'http://vm-angular-rc:8082';

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
                children: [
                    {
                        state: 'numerisation',
                        name: 'Numérisation',
                        route: 'ingests'
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier',
                        route: 'detail-file'

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
        label: 'Dates diffusions',
        url: `${this.distUrl}diffusions-dates/`,
        main: [
            {
                state: 'dates diffusions',
                short_label: 'm',
                name: 'DatesDiffusions',
                type: 'sub',
                icon: 'icon-home',
                children: [
                    {
                        state: 'dates-de-diffusions',
                        name: 'Dates de diffusions',
                        route: 'diffusions-dates'
                    }
                ]
            }
        ]
    }
];
