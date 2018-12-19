export class QualiteLib {
    Code: number;
    Libelle: string;
    Etat: boolean;
    Fiche_Mat_Qualite: any;
    FicheAch_FA_Det_Mat_Qualite: any;
}

export class QualiteFM {
    IdMat_Qualite: number;
    IdFicheMateriel: number;
    idLibQualiteSup: number;
    IsValid: boolean;
    Fiche_Mat_Fichemateriel: any;
    LibQualiteSup: any;
}
