import { navbarReducer } from './navbar.reducer';
import { navbarInitialState } from './navbar.init';
import { Navbar } from './navbar.interfaces';
import { NavbarAction, OpenNavbar } from './navbar.actions';

describe('navbarReducer', () => {

  it('should change navbar state to open', () => {
    const actual = navbarReducer({ open: false }, { type: 'OPEN_NAVBAR', payload: {} });
    const expected = { open: true };
    expect(actual).toEqual(expected);
  });

  it('should change navbar state to close', () => {
    const actual = navbarReducer({ open: true }, { type: 'CLOSE_NAVBAR', payload: {} });
    const expected = { open: false };
    expect(actual).toEqual(expected);
  });

});
