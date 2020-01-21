import {App} from './app.interfaces';
import {UserAction} from './app.actions';

export function appReducer(state: App, action: UserAction): App {
  switch (action.type) {
    case 'ADD_USER': {
      console.log('add-user');
      console.log(state);
      console.log(action);
      state.user.name = action.payload.user.name;
      state.user.username = action.payload.user.username;
      state.user.shortUserName = action.payload.user.shortUserName;
      console.log(state);

     return state;
    }
    case 'DELETE_USER': {
      console.log('delate user state => ', state);
      console.log(action);
      return {
        user : {
          name: '',
          username: '',
          shortUserName: '',
          rights: {
            modification: '',
            consultation: '',
            presse: ''
          }
        },
        appInfo : {
          name: state.appInfo.name,
          code: state.appInfo.code,
        }
      };
    }
    case 'ADD_APP_INFO': {
      console.log('add-app-info');
      console.log(state);
      console.log(action);
      console.log(state);
      state.appInfo.name = action.payload.appInfo.name;
      state.appInfo.code = action.payload.appInfo.code;
      return state;
    }
    case 'ADD_USER_RIGHTS': {
      console.log('add-app-info');
      console.log(state);
      console.log(action);
      console.log(state);
      state.user.rights = action.payload.user.rights;
      return state;
    }
    default: {
      return state;
    }
  }
}
