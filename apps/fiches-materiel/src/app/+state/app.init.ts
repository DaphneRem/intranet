import {App} from './app.interfaces';

export const appInitialState: App = {
  // fill it initial state here
  user : {
    username: '',
    name: '',
    shortUserName: '',
    rights: {
      modification: '',
      consultation: '',
      presse: ''
    }
  },
  appInfo: {
    name: '',
    code: 0
  }
};

// name: "NOM Prenom"
// userName: "prenom.nom@mediawan.com"
// shortUserName: "NOM-P"
