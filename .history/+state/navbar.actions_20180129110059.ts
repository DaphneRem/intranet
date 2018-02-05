import { Action } from '@ngrx/store';

export const OPEN_NAVBAR = 'OPEN_NAVBAR';

export const CLOSE_NAVBAR = 'CLOSE_NAVBAR';

export const SHOW_NAVBAR_STATE = 'SHOW_NAVBAR_STATE';



export interface OpenNavbar {
  type: 'OPEN_NAVBAR';
  payload: {};
}

export interface CloseNavbar {
  type: 'CLOSE_NAVBAR';
  payload: {};
}

export interface ShowNavbarState {
  type: 'SHOW_NAVBAR_STATE';
  payload: {};
}


export type NavbarAction = OpenNavbar | CloseNavbar | ShowNavbarState;

