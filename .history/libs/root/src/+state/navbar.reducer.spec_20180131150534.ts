import { navbarReducer } from './navbar.reducer';
import { navbarInitialState } from './navbar.init';
import { Navbar } from './navbar.interfaces';
import { NavbarAction, OpenNavbar } from './navbar.actions';

describe('navbarReducer', () => {

  it('should change navbar state to open (open = true)', () => {
    const actual = navbarReducer({ open: false }, { type: 'OPEN_NAVBAR', payload: {} });
    const expected = { open: true };
    expect(actual).toBe(expected);

    // const state: Navbar = { open: false };
    // const action: DataLoaded = {type: 'DATA_LOADED', payload: {}};
    // const actual = navbarReducer(state, action);
    // expect(actual).toEqual({});
  });
});
