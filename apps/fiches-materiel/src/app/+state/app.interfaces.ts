export interface App {
  user: User;
}

export interface User {
  username: string;
  name: string;
}

export interface AppState {
  readonly app: App;
}
