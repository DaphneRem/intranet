import {State} from './navbar.interfaces';
import { LayoutActions, LayoutActionTypes } from './navbar.actions';


const initialState: State = {
  isOpen: true
};

export function navbarReducer(
  state: State = initialState,
  action: LayoutActions
): State {
  switch (action.type) {
    case LayoutActionTypes.OpenNavbar:
      this.state.isOpen = true;
      return this.state;

    case LayoutActionTypes.CloseNavbar:
      this.state.isOpen = false;
      return this.state;

    case LayoutActionTypes.StateNavbar:
      return this.state.isOpen;

    default:
      return state;
  }
}
