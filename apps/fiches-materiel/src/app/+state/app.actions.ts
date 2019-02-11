export interface AddConnectedUser {
  type: 'ADD_USER';
  payload: {
    user: {
      username: string,
      name: string,
      shortUserName: string
    }
  };
}

export interface DeleteConnectedUser {
  type: 'DELETE_USER';
  payload: {
    user: {
      username: string,
      name: string,
      shortUserName: string
    }
  };
}

export type UserAction = AddConnectedUser | DeleteConnectedUser;
