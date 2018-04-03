import { Injectable } from '@angular/core';

import { CustomThemes } from '../data/custom-datatables-themes-data';
export { Theme } from '../models/custom-datatables-themes';


@Injectable()
export class CustomThemesService {


  getTheme(name: string) {
    let theme;
    CustomThemes.map(item => {
      if (item.name === name) {
        return theme = item;
      }
    });
      return theme;
    }
}
