import { Injectable } from '@angular/core';

import { Menu } from './menu-items';
import { MENUITEMS } from './data/menu-items-data';

@Injectable()

export class MenuItems {

    getAll(): Menu[] {
        return MENUITEMS;
    }

}
