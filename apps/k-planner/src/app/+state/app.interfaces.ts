export interface App {
  user: User;
}

export interface User {
  username: string;
  name: string;
  initials: string;
  shortUserName: string;
  numGroup: number;
}

export interface AppState {
  readonly app: App;
}
