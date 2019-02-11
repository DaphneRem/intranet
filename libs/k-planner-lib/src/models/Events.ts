export class EventModel{

    Id: number; //Id_Planning_Container
    Name: string; // Titre
    StartTime: Date | string;
    EndTime: Date | string;
    Statut?: number;
    coordinateurCreate?: string;
    Operateur?: string;
    CodeRessourceSalle: number;
    Description?: string;
    Container:Boolean;
    numGroup:number; //Id_Planning_Container
    AzaIsPere?: boolean;
    AzaNumGroupe?: number;
    DepartmentID?: number;
}