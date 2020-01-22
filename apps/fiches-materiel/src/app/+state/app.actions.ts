export interface AddConnectedUser {
  type: 'ADD_USER';
  payload: {
    user: {
      username: string,
      name: string,
      shortUserName: string,
    }
  };
}

export interface DeleteConnectedUser {
  type: 'DELETE_USER';
  payload: {
    user: {
      username: string,
      name: string,
      shortUserName: string,
      rights: string,
    },
    appInfo: {
      name: string,
      code: number
    }
  };
}

export interface AddAppInfo {
  type: 'ADD_APP_INFO';
  payload: {
    appInfo: {
      name: string,
      code: number
    }
  };
}


export interface AddUserRights {
  type: 'ADD_USER_RIGHTS';
  payload: {
    user: {
      rights: {
        modification: string;
        consultation: string;
        presse: string;
      }
    }
  };
}


export type UserAction = AddConnectedUser | DeleteConnectedUser | AddAppInfo | AddUserRights;
