import { Workorder } from './workorder';

export class ContainerKP {
         Id_Planning_Container: number;
         UserEnvoi: string;
         DateEnvoi: string | Date;
         Titre: string;
         CodeRessourceOperateur: number;
         LibelleRessourceOperateur: string;
         CodeRessourceCoordinateur: number;
         LibelleRessourceCoordinateur: string;
         DateSoumission: string | Date;
         DateDebut: string | Date;
         DateFin: string | Date;
         DateDebutTheo: string | Date;
         DateFinTheo: string | Date;
         CodeRessourceSalle: number;
         LibelleRessourceSalle: string;
         Commentaire: string;
         Commentaire_Planning: string;
         DateMaj: string | Date;
         UserMaj: string;
         PlanningEventsList: Workorder[];

        //  ConsultantID: number;
       }
