export class UserAppRights {
    Mail: string;
    Modules: Module[];
    UserName: string;
}

export class Module {
    CodeModule: number;
    ListeRight: ListeRight;
    Right: number;
}

export class ListeRight {
    ADMINISTRATION: boolean;
    CONSULTATION: boolean;
    MODIFICATION: boolean;
    SUPPRESSION: boolean;
}
