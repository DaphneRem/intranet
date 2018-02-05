export interface OpenNavbar {
  type: 'OPEN_NAVBAR';
  payload: {};
}

export interface CloseNavbar {
  type: 'CLOSE_NAVBAR';
  payload: {};
}

export interface NavbarIsOpen {
  type: 'NAVBAR_IS_OPEN';
  payload: {};
}


export type NavbarAction = OpenNavbar | CloseNavbar | NavbarIsOpen;

