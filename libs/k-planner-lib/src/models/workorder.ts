export class Workorder {

    Id_Planning_Events: number;
    Iddetail: number;
    IdTypeWO: number;
    UserEnvoi: string;
    DateEnvoi: string | Date;
    CodeRessourceOperateur: number;
    // LibelleRessourceOperateur: string;
    CodeRessourceCoordinateur: number;
    // LibelleRessourceCoordinateur: string;
    DateSoumission: string | Date;
    DateDebut: string | Date;
    DateFin: string | Date;
    DateDebutTheo: string | Date;
    DateFinTheo: string | Date;
    CodeRessourceSalle: number;
    Commentaire: string;
    Support1Cree: string;
    Support2Cree: string;
    MustWaitFor: number;
    Statut: number;
    idplanningprec: number;
    Regroup: number;
    Commentaire_Planning: string;
    DateMaj: string | Date;
    UserMaj: string;
    Id_Planning_Container: number;
    libtypeWO: string;
    isbacklog: number;
    // +
    groupe: number;
    libchaine: string;
    typetravail: string;
    titreoeuvre: string;
    numepisode: number;
    dureecommerciale: string; // vérifier le type
    dureesegment: string; // vérifier le type
    titreepisode: string; // vérifier le type
}

