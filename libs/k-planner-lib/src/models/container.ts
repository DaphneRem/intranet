import { EventScheduler } from './event-scheduler';

export class Container {

    Id_Planning_Container: number;
    Iddetail: number;
    UserEnvoi: string;
    DateEnvoi: Date | string;
    Operateur: string;
    Coordinateur: string;
    DateSoumission: Date | string;
    DateDebut: Date | string;
    DateFin: Date | string;
    DateDebutTheo: Date | string;
    DateFinTheo: Date | string;
    CodeSalle: number;
    Commentaire: string;
    Commentaire_Planning: string;
    DateMaj: Date | string;
    UserMaj: string;
    PlanningEventsList: EventScheduler[];

}
