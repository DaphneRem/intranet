import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      return state = true;
    }
    case 'CLOSE_NAVBAR': {
      return state = false;
    }
    case 'SHOW_NAVBAR_STATE': {
      return state;
    }
    default: {
      return state;
    }
  }
}