import { Action } from '@ngrx/store';

// export interface OpenNavbar {
//   type: 'OPEN_NAVBAR';
//   payload: {};
// }

// export interface CloseNavbar {
//   type: 'CLOSE_NAVBAR';
//   payload: {};
// }

// export interface ShowNavbarState {
//   type: 'SHOW_NAVBAR_STATE';
//   payload: {};
// }

// export type NavbarAction = OpenNavbar | CloseNavbar | ShowNavbarState;

export enum LayoutActionTypes {
  OpenNavbar = "[Layout] Open Navbar",
  CloseNavbar = "[Layout] Close Navbar",
  StateNavbar = '[Layout] State Navbar'
}

export class OpenNavbar implements Action {
  readonly type = LayoutActionTypes.OpenNavbar;
}

export class CloseNavbar implements Action {
  readonly type = LayoutActionTypes.CloseNavbar;
}

export class StateNavbar {
  readonly type = LayoutActionTypes.CloseNavbar;
}

export type LayoutActions = OpenNavbar | CloseNavbar;
