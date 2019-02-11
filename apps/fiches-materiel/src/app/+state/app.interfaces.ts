export interface App {
  user: User;
}

export interface User {
  username: string;
  name: string;
  shortUserName: string;
}

export interface AppState {
  readonly app: App;
}
