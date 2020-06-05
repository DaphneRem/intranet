import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';

export let colorStatut: Object[] = [
    { Id: 0, Color: '#e8e2ae' },
    { Id: 1, Color: '#e8e2ae' },
    { Id: 2, Color: '#2471A3' }, // pise en charge
    { Id: 3, Color: '#F3BE09' }, //  STATUT_A_AFFECTER JAUNE
    { Id: 4, Color: '#F3BE09' },
    { Id: 5, Color: '#c2dced' }, //  STATUT_A_FINIR(pause)
    { Id: 6, Color: '#3ba506' }, //  STATUT_TERMINE_OK VERT
    { Id: 7, Color: '#B01106' }, //   STATUT_TERMINE_KO ROUGE
    { Id: 8, Color: '#F39009' }, //   STATUT_EN_ATTENTE ORANGE
    { Id: 9, Color: '#e8e2ae' },
    { Id: 10, Color: '#3ba506' },//  STATUT_TACHES_OK
    { Id: 11, Color: '#B01106' },
    { Id: 12, Color: '#17AAB2' },
    { Id: 13, Color: '#17AAB2' },
    { Id: 15, Color: '#2471A3' }, // pise en charge (remplacer par remy)
]

export let menuItemsSchedule: MenuItemModel[] = [
    {
        text: 'Déplacer',
        iconCss: 'e-icons RowDragMove ' ,
        id:'deplacer'
    },
    {
        text: 'Poser',
        iconCss: 'e-icons' ,
        id:'poser'
    },
    {
        text: 'Split',
        iconCss: 'e-icons' ,
        id:'split'
    },
    {
        text: 'Dupliquer',
        iconCss: 'e-icons' ,
        id:'dupliquer'
    }
];


export let  menuItems: MenuItemModel[] = [
    {
        text: 'Supprimer',
        iconCss: 'e-icons delete',
        id:'Supprimer'
    },
    {
        text: 'Plus de détails',
        iconCss: 'e-icons new',
        id:'details'
    }
];