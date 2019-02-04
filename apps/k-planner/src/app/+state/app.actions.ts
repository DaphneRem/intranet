export interface AddConnectedUser {
  type: 'ADD_USER';
  payload: {
    user: {
      username: string,
      name: string,
      initials: string
    }
  };
}

export interface DeleteConnectedUser {
  type: 'DELETE_USER';
  payload: {
    user: {
      username: string,
      name: string,
      initials: string
    }
  };
}

export type UserAction = AddConnectedUser | DeleteConnectedUser;
