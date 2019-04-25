export class WorkorderBacklog {
    Id: number;
    AzaIsPere: boolean;
    AzaNumGroupe: number;
    CodeRessourceSalle: number;
    Commentaire_Planning: string;
    ConsultantID: number;
    Container: boolean;
    DepartmentID: number;
    DepartmentName: string;
    Description: string;
    EndTime: Date | string;
    IdGenerationWO: number;
    IsAllDay: boolean;
    Name: string;
    Operateur: string;
    StartTime: Date | string;
    Statut: number;
    coordinateurCreate: string;
    dureecommerciale: string;
    libchaine: string;
    libtypeWO: string;
    numGroup: number;
    numepisode: number;
    titreoeuvre: string;
    typetravail: string;
    // Ajouté par rapport au container event
    Commentaire: string;
    debut: any; // TYPE A REVERIFIER
    fin: any; // TYPE A REVERIFIER
    dureeestime: any; // TYPE A REVERIFIER
    idwoprec: any; // TYPE A REVERIFIER
}
