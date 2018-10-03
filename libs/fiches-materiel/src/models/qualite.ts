export class Qualite {
    Code: number;
    Libelle: string;
    Etat: boolean;
    Fiche_Mat_Qualite: any;
    FicheAch_FA_Det_Mat_Qualite: any;
}

export class QualiteByFM {
    IdFicheMateriel: number;
    IsValid: boolean;
    idLibQualiteSup: number;
}
