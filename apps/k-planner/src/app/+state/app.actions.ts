export interface AddConnectedUser {
  type: 'ADD_USER';
  payload: {
    user: {
      username: string,
      name: string,
      initials: string,
      shortUserName: string,
      numGroup: number;
    }
  };
}

export interface DeleteConnectedUser {
  type: 'DELETE_USER';
  payload: {
    user: {
      username: string,
      name: string,
      initials: string,
      shortUserName: string,
      numGroup: number;
    }
  };
}

export type UserAction = AddConnectedUser | DeleteConnectedUser;
