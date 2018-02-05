import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      return state.open = true;
    }
    case 'CLOSE_NAVBAR': {
      return state.open = false;
    }
    case 'SHOW_NAVBAR_STATE': {
      console.log(state);
      return state.open;
    }
    default: {
      return state;
    }
  }
}
