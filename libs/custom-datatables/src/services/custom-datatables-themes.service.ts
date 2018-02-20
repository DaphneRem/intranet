import { Injectable } from '@angular/core';
import { CUSTOMTHEMES } from '../data/custom-datatables-themes-data';
import { Theme } from '@ab/custom-datatables';


@Injectable()
export class CustomThemesService {


  getTheme(name: string) {
    let theme;
    CUSTOMTHEMES.map(item => {
      if (item.name === name) {
        return theme = item;
      }
    });
      return theme;
    }
}
