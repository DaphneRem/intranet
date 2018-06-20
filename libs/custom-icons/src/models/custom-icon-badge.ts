export class CustomIconBadge {
    littleIcon: LittleIcon;
    bigIcon: BigIcon;
    link?: string;
}

export class LittleIcon {
    color?: string;
    circleColor: string;
    icon: string;
    iconSize: string;
    iconMargin: string;
}

export class BigIcon {
    icon: string;
    circleColor: string;
    iconSize?: string;
}
