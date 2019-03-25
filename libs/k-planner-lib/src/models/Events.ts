export class EventModel{

    Id: number; // Id_Planning_Container
    Name: string; // Titre
    StartTime: Date | string;
    EndTime: Date | string;
    Statut?: number;
    coordinateurCreate?: string;
    Operateur?: string;
    CodeRessourceSalle: number;
    Description?: string;
    Container:Boolean;
    numGroup:number; // Id_Planning_Container
    AzaIsPere?: boolean;
    AzaNumGroupe?: number;
    DepartmentID?: number;
    DepartmentName?: string;
   ConsultantID: number;
   IsAllDay: boolean;
   libchaine:string;
   typetravail?:string;
   titreoeuvre?:string;
   numepisode?:number;
   dureecommerciale?:string;
   libtypeWO?: string;
   Commentaire_Planning?: string;
   Id_Planning_Container?:number;
}

    // Id: number;
    // Name: string;
    // StartTime: Date | string;
    // EndTime: Date | string;
    // Description?: string;
    // DepartmentID: number;
    // ConsultantID: number;
    // DepartmentName?: string;
    // className?: string;
    // AzaIsPere?: boolean;
    // AzaNumGroupe?: number;
    // IconUrl?: string;
    // coordinateurCreate?: string;
    // Operateur: string;