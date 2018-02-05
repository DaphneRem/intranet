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
    main: MainMenuItems[];
}

const MENUITEMS = [
    {
        label: 'Navigation',
        main: [
            {
                state: 'dashboard',
                short_label: 'D',
                name: 'Dashboard',
                type: 'sub',
                icon: 'icon-home',
                children: [
                    {
                        state: 'default',
                        name: 'Default'
                    },
                    {
                        state: 'ecommerce',
                        name: 'Ecommerce'
                    },
                    {
                        state: 'analytics',
                        name: 'Analytics',
                        badge: [
                            {
                                type: 'info',
                                value: 'NEW'
                            }
                        ]
                    }
                ]
            },
            {
                state: 'navigation',
                short_label: 'N',
                name: 'Navigation',
                type: 'link',
                icon: 'icon-layout-cta-right'
            },
            {
                state: 'widget',
                short_label: 'W',
                name: 'Widget',
                type: 'sub',
                icon: 'icon-view-grid',
                badge: [
                    {
                        type: 'danger',
                        value: '100+'
                    }
                ],
                children: [
                    {
                        state: 'statistic',
                        name: 'Statistic'
                    },
                    {
                        state: 'data',
                        name: 'Data'
                    },
                    {
                        state: 'chart',
                        name: 'Chart'
                    }
                ]
            }
        ],
    },
    {
        label: 'Technique',
        main: [
            {
                state: 'numerisation',
                short_label: 'N',
                name: 'Numérisation',
                type: 'link',
                icon: 'icon-layout-grid2-alt'
            },
            {
                state: 'detail-fichiers',
                short_label: 'D',
                name: 'Détail Fichier',
                type: 'link',
                icon: 'icon-crown'
            },
            {
                state: 'fichiers-purges',
                short_label: 'F',
                name: 'Fichiers Purgés',
                type: 'link',
                icon: 'icon-reload rotate-refresh'
            }
        ]
    },
    {
        label: 'Forms',
        main: [
            {
                state: 'forms',
                short_label: 'F',
                name: 'Form',
                type: 'sub',
                icon: 'icon-layers',
                children: [
                    {
                        state: 'basic',
                        name: 'Components'
                    }, {
                        state: 'add-on',
                        name: 'Add-On'
                    }, {
                        state: 'advance',
                        name: 'Advance'
                    }, {
                        state: 'validation',
                        name: 'Validation'
                    }
                ]
            },
            {
                state: 'picker',
                short_label: 'P',
                main_state: 'forms',
                name: 'Form Picker',
                type: 'link',
                icon: 'icon-pencil-alt',
                badge: [
                    {
                        type: 'warning',
                        value: 'New'
                    }
                ]
            },
            {
                state: 'select',
                short_label: 'S',
                main_state: 'forms',
                name: 'Form Select',
                type: 'link',
                icon: 'icon-shortcode'
            }
        ]
    },
    {
        label: 'Tables',
        main: [
            {
                state: 'bootstrap-table',
                short_label: 'B',
                name: 'Bootstrap Table',
                type: 'sub',
                icon: 'icon-receipt',
                children: [
                    {
                        state: 'basic',
                        name: 'Basic Table'
                    }, {
                        state: 'sizing',
                        name: 'Sizing Table'
                    }, {
                        state: 'border',
                        name: 'Border Table'
                    }, {
                        state: 'styling',
                        name: 'Styling Table'
                    }
                ]
            },
            {
                state: 'data-table',
                short_label: 'D',
                name: 'Data Table',
                type: 'sub',
                icon: 'icon-widgetized',
                children: [
                    {
                        state: 'basic',
                        name: 'Basic Table'
                    }, {
                        state: 'editable',
                        name: 'Editable'
                    }, {
                        state: 'row-details',
                        name: 'Row Details Table'
                    }, {
                        state: 'paging',
                        name: 'Paging Table'
                    }, {
                        state: 'selection',
                        name: 'Selection Table'
                    }
                ]
            }
        ]
    },
    {
        label: 'Chart And Map',
        main: [
            {
                state: 'charts',
                short_label: 'C',
                name: 'Charts',
                type: 'sub',
                icon: 'icon-bar-chart-alt',
                children: [
                    {
                        state: 'google',
                        name: 'Google'
                    }, {
                        state: 'chart-js',
                        name: 'ChartJS'
                    }, {
                        state: 'radial',
                        name: 'Radial'
                    }, {
                        state: 'c3-js',
                        name: 'C3 JS'
                    }
                ]
            },
            {
                state: 'map',
                short_label: 'M',
                name: 'Maps',
                type: 'sub',
                icon: 'icon-map-alt',
                children: [
                    {
                        state: 'google',
                        name: 'Google'
                    }
                ]
            },
            /*{
              state: 'landing',
              short_label: 'L',
              external: 'http://html.codedthemes.com/gradient-able-5/default/landingpage',
              name: 'Landing Page',
              type: 'external',
              icon: 'icon-mobile',
              target: true
            }*/
        ]
    },
    {
        label: 'Pages',
        main: [
            {
                state: 'auth',
                short_label: 'A',
                name: 'Authentication',
                type: 'sub',
                icon: 'icon-id-badge',
                children: [
                    {
                        state: 'login',
                        type: 'sub',
                        name: 'Login Pages',
                        children: [
                            {
                                state: 'simple',
                                name: 'Simple',
                                target: true
                            }, {
                                state: 'header-footer',
                                name: 'Header & Footer',
                                target: true
                            }, {
                                state: 'social',
                                name: 'Social Icon',
                                target: true
                            }, {
                                state: 'social-header-footer',
                                name: 'Social Header & Footer',
                                target: true
                            }
                        ]
                    }, {
                        state: 'registration',
                        type: 'sub',
                        name: 'Registration Pages',
                        children: [
                            {
                                state: 'simple',
                                name: 'Simple',
                                target: true
                            }, {
                                state: 'header-footer',
                                name: 'Header & Footer',
                                target: true
                            }, {
                                state: 'social',
                                name: 'Social',
                                target: true
                            }, {
                                state: 'social-header-footer',
                                name: 'Social Header & Footer',
                                target: true
                            }
                        ]
                    },
                    {
                        state: 'forgot',
                        name: 'Forgot Password',
                        target: true
                    },
                    {
                        state: 'lock-screen',
                        name: 'Lock Screen',
                        target: true
                    },
                ]
            },
            {
                state: 'maintenance',
                short_label: 'A',
                name: 'Maintenance',
                type: 'sub',
                icon: 'icon-settings',
                children: [
                    /*{
                      state: 'error',
                      name: 'Error'
                    },
                    {
                      state: 'coming-soon',
                      name: 'Coming Soon'
                    },*/
                    {
                        state: 'offline-ui',
                        name: 'Offline UI',
                        target: true
                    }
                ]
            },
            {
                state: 'user',
                short_label: 'U',
                name: 'User Profile',
                type: 'sub',
                icon: 'icon-user',
                children: [
                    {
                        state: 'profile',
                        name: 'User Profile'
                    }, {
                        state: 'card',
                        name: 'User Card'
                    }
                ]
            }
        ]
    },
    {
        label: 'App',
        main: [
            {
                state: 'task',
                short_label: 'T',
                name: 'Task',
                type: 'sub',
                icon: 'icon-check-box',
                children: [
                    {
                        state: 'list',
                        name: 'Task List'
                    }, {
                        state: 'board',
                        name: 'Task Board'
                    }, {
                        state: 'details',
                        name: 'Task Details'
                    }, {
                        state: 'issue',
                        name: 'Issue List'
                    }
                ]
            }
        ]
    },
    {
        label: 'Extension',
        main: [
            {
                state: 'invoice',
                short_label: 'I',
                name: 'Invoice',
                type: 'sub',
                icon: 'icon-layout-media-right',
                children: [
                    {
                        state: 'basic',
                        name: 'Invoice'
                    }, {
                        state: 'summary',
                        name: 'Invoice Summary'
                    }, {
                        state: 'list',
                        name: 'Invoice List'
                    }
                ]
            },
            {
                state: 'file-upload-ui',
                short_label: 'F',
                name: 'File Upload',
                type: 'link',
                icon: 'icon-cloud-up'
            },
            /*{
              state: 'documentation',
              short_label: 'D',
              name: 'Documentation',
              external: 'http://html.codedthemes.com/gradient-able/doc-angular-5',
              type: 'external',
              icon: 'icon-file',
              target: true
            }*/
        ]
    },
    {
        label: 'Other',
        main: [
            {
                state: '',
                short_label: 'M',
                name: 'Menu Levels',
                type: 'sub',
                icon: 'icon-direction-alt',
                children: [
                    {
                        state: '',
                        name: 'Menu Level 2.1',
                        target: true
                    }, {
                        state: '',
                        name: 'Menu Level 2.2',
                        type: 'sub',
                        children: [
                            {
                                state: '',
                                name: 'Menu Level 2.2.1',
                                target: true
                            },
                            {
                                state: '',
                                name: 'Menu Level 2.2.2',
                                target: true
                            }
                        ]
                    }, {
                        state: '',
                        name: 'Menu Level 2.3',
                        target: true
                    }, {
                        state: '',
                        name: 'Menu Level 2.4',
                        type: 'sub',
                        children: [
                            {
                                state: '',
                                name: 'Menu Level 2.4.1',
                                target: true
                            },
                            {
                                state: '',
                                name: 'Menu Level 2.4.2',
                                target: true
                            }
                        ]
                    }
                ]
            },
            {
                state: 'simple-page',
                short_label: 'S',
                name: 'Simple Page',
                type: 'link',
                icon: 'icon-layout-sidebar-left'
            }
        ]
    },
    {
        label: 'Support',
        main: [
            /*{
              state: 'documentation',
              short_label: 'D',
              name: 'Documentation',
              external: 'http://html.codedthemes.com/guru-able/doc-angular-4',
              type: 'external',
              icon: 'icon-file',
              target: true
            },*/
            {
                state: 'submit-issue',
                short_label: 'S',
                external: 'https://codedthemes.com/submit-ticket/',
                name: 'Submit Issue',
                type: 'external',
                icon: 'icon-layout-list-post',
                target: true
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