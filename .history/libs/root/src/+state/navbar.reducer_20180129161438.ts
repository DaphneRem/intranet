import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      this.state = true;
      return this.state;
    }
    case 'CLOSE_NAVBAR': {
      this.state = false;
      return this.state;
    }
    case 'SHOW_NAVBAR_STATE': {
      this.state = false;
      return this.state;
    }
    default: {
      return state;
    }
  }
}
