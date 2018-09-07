import {App} from './app.interfaces';
import {UserAction} from './app.actions';

export function appReducer(state: App, action: UserAction): App {
  switch (action.type) {
    case 'ADD_USER': {
      console.log('add-user');
      console.log(state);
      console.log(action);
      state = {...action.payload};
            console.log(state);

     return state;
    }
    case 'DELETE_USER': {
      console.log(state);
      console.log(action);
      return {
        user : {
          name: '',
          username: ''
        }
      };
    }
    default: {
      return state;
    }
  }
}
