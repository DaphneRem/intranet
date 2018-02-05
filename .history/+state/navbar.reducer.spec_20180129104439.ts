import { navbarReducer } from './navbar.reducer';
import { navbarInitialState } from './navbar.init';
import { Navbar } from './navbar.interfaces';
import { DataLoaded } from './navbar.actions';

describe('navbarReducer', () => {
  it('should work', () => {
    const state: Navbar = {};
    const action: DataLoaded = {type: 'DATA_LOADED', payload: {}};
    const actual = navbarReducer(state, action);
    expect(actual).toEqual({});
  });
});
