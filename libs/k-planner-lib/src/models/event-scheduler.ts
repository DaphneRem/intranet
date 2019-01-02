export class EventScheduler {

    Id_Planning_Events: number;
    Iddetail: number;
    IdTypeWO: number;
    UserEnvoi: string;
    DateEnvoi: Date | string;
    Operateur: string;
    DateSoumission: Date | string;
    DateDebut:  Date | string;
    DateFin: Date | string;
    DateDebutTheo: Date | string;
    DateFinTheo: Date | string;
    CodeSalle: number;
    Commentaire: string;
    Support1Cree: any; // null
    Support2Cree: any; // null
    MustWaitFor: any; // null
    Statut: number;
    idplanningprec: any; // null
    Regroup: any; // null
    Commentaire_Planning: any; // null
    DateMaj: Date | string;
    UserMaj: string;
    Id_Planning_Container: number;
    libtypeWO: string;

}
