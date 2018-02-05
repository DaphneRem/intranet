import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  //  console.log('ACTION:', action.type, action.payload, state);
  switch (action.type) {
    case 'OPEN_NAVBAR': {
      console.log('open');
      return (state = { open: true });
    }
    case 'CLOSE_NAVBAR': {
      console.log('close');
      return state = { open: false };
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
