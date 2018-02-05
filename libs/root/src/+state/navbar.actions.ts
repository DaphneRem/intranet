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
