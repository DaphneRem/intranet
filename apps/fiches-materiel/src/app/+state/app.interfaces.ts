export interface AppState {
  readonly app: App;
}

export interface App {
  user: User;
  appInfo: AppInfo;
}

export interface User {
  username: string;
  name: string;
  shortUserName: string;
  rights: Rights;
}

export interface Rights {
  modification: string;
  consultation: string;
  presse: string;
}

export interface AppInfo {
  name: string;
  code: number;
}
