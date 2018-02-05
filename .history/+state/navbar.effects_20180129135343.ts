import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {DataPersistence} from '@nrwl/nx';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/switchMap';

import {NavbarState} from './navbar.interfaces';
import { OpenNavbar, CloseNavbar, ShowNavbarState } from './navbar.actions';

@Injectable()
export class NavbarEffects {
  @Effect()
  openNavbar = this.dataPersistence.fetch('OPEN_NAVBAR', {
    run: (action: OpenNavbar, state: NavbarState) => {
      return {
        type: 'OPEN_NAVBAR',
        payload: {}
      };
    },

    onError: (action: OpenNavbar, error) => {
      console.error('Error', error);
    }
  });
  @Effect()
  closeNavbar = this.dataPersistence.fetch('CLOSE_NAVBAR', {
    run: (action: CloseNavbar, state: NavbarState) => {
      return {
        type: 'CLOSE_NAVBAR',
        payload: {}
      };
    },

    onError: (action: CloseNavbar, error) => {
      console.error('Error', error);
    }
  });
  @Effect()
  showNavbarState = this.dataPersistence.fetch('SHOW_NAVBAR_STATE', {
    run: (action: ShowNavbarState, state: NavbarState) => {
      return {
        type: 'SHOW_NAVBAR_STATE',
        payload: {}
      };
    },

    onError: (action: ShowNavbarState, error) => {
      console.error('Error', error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<NavbarState>
  ) {}
}
