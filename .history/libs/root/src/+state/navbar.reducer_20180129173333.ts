import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
   console.log('ACTION:', action.type, action.payload, state);
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      state['open'] = true;
      return state;
    }
    case 'CLOSE_NAVBAR': {
       state['open'] = false;
      return state;
    }
    case 'SHOW_NAVBAR_STATE': {
      console.log(state);
      return state;
    }
    default: {
      return state;
    }
  }
}
