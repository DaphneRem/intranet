import {Navbar} from './navbar.interfaces';
import {NavbarAction} from './navbar.actions';

export function navbarReducer(
  state: Navbar,
  action: NavbarAction
): Navbar {
  switch (action.type) {
    case 'DATA_LOADED': {
      return {...state, ...action.payload};
    }
    default: {
      return state;
    }
  }
}
