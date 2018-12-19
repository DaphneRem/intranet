import { Navbar } from './navbar.interfaces';
import { NavbarAction } from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
) {
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
    default: {
      return state;
    }
  }
}
