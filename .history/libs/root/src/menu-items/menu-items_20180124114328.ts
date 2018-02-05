import { Injectable } from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    target?: boolean;
    name: string;
    type?: string;
    children?: ChildrenItems[];
}

export interface MainMenuItems {
    state: string;
    short_label?: string;
    main_state?: string;
    target?: boolean;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
}

export interface Menu {
    label: string;
    distUrl: string;
    main: MainMenuItems[];
}

const MENUITEMS = [
    {
        label: 'Menu',
        distUrl: 'http://127.0.0.1/edsa-Angular/ng-nx-project/dist/apps/',
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
                        name: 'Numérisation'
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier'
                    },
                    {
                        state: 'fichiers-purges',
                        name: 'Fichiers Purgés',
                        badge: [
                            {
                                type: 'info',
                                value: 'NEW'
                            }
                        ]
                    }
                ]
            },
            // {
            //     state: 'navigation',
            //     short_label: 'N',
            //     name: 'Navigation',
            //     type: 'link',
            //     icon: 'icon-layout-cta-right'
            // },
            // {
            //     state: 'widget',
            //     short_label: 'W',
            //     name: 'Widget',
            //     type: 'sub',
            //     icon: 'icon-view-grid',
            //     badge: [
            //         {
            //             type: 'danger',
            //             value: '100+'
            //         }
            //     ],
            //     children: [
            //         {
            //             state: 'statistic',
            //             name: 'Statistic'
            //         },
            //         {
            //             state: 'data',
            //             name: 'Data'
            //         },
            //         {
            //             state: 'chart',
            //             name: 'Chart'
            //         }
            //     ]
            // }
        ],
    }
];

@Injectable()
export class MenuItems {
    getAll(): Menu[] {
        return MENUITEMS;
    }
}
