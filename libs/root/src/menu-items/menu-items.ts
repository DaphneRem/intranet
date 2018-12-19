export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    routerLink?: string;
    target?: boolean;
    name: string;
    type?: string;
    children?: ChildrenItems[];
}

export interface MainMenuItems {
    state: string;
    short_label?: string;
    main_state?: string;
    target?: boolean;
    name: string;
    type: string;
    icon: string;
    iconColor?: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
}

export interface Menu {
    label: string;
    url: string;
    main: MainMenuItems[];
}
