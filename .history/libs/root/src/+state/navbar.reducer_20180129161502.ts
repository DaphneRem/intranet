import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      this.state.isOpen = true;
      return this.state;
    }
    case 'CLOSE_NAVBAR': {
      this.state.isOpen = false;
      return this.state;
    }
    case 'SHOW_NAVBAR_STATE': {
      state = false;
      return state;
    }
    default: {
      return state;
    }
  }
}
