import { Injectable } from '@angular/core';


Injectable();
export class Globals {
    distUrl = 'http://127.0.0.1/edsa-Angular/ng-nx-project/dist/apps/';
    links: any = [
        {
            name: 'App Root',
            url: `${this.distUrl}app0/`,
            icon: 'fa fa-fw fa-dashboard'
        },
        {
            name: 'App 1',
            url: `${this.distUrl}app1/`,
            icon: 'fa fa-fw fa-bar-chart-o'

        },
        {
            name: 'App 2',
            url: `${this.distUrl}dist-app2`,
            icon: 'fa fa-fw fa-table'

        },
        {
            name: 'App 3',
            url: `${this.distUrl}dist-app3`,
            icon: 'fa fa-fw fa-edit'
        },
        {
            name: 'App 4',
            url: `${this.distUrl}dist-app4`,
            icon: 'fa fa-fw fa-desktop'

        }
    ];
}