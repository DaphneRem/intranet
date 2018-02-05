import { Injectable } from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    routerLink?: string;
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
    url: string;
    main: MainMenuItems[];
}

const distUrl = 'http://127.0.0.1/edsa-Angular/ng-nx-project/dist/apps/';

const MENUITEMS = [
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
                        routerLink: 'xxx'
                    },
                    {
                        state: 'detail-fichier',
                        name: 'Détail Fichier',
                        routerLink: 'xxx'

                    },
                    {
                        state: 'fichiers-purges',
                        name: 'Fichiers Purgés',
                        routerLink: 'xxx',
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

@Injectable()
export class MenuItems {
    getAll(): Menu[] {
        return MENUITEMS;
    }
}
