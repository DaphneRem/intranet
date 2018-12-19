export class AnnexElementStatus {
    IdStatutElementsAnnexes: number;
    Libelle: string;
    Fiche_Mat_Fichemateriel: any;
}

export class AnnexElementCategory {
    IdLibCategorieElementsAnnexes: number;
    Libelle: string;
    Fiche_Mat_CategorieElementsAnnexesCommentaire: any;
    Fiche_Mat_LibElementAnnexes: any;
}

export class AnnexElementSubCategory {
    IdLibElementAnnexes: number;
    IdCategorie: number;
    Libelle: string;
    Fiche_Mat_ElementsAnnexes: any;
    Fiche_Mat_LibCategorieElementsAnnexes: any;
}

export class AnnexElementFicheMAteriel {
    IdElementsAnnexes: number;
    IdFicheMateriel: number;
    IdPackageAttendu: number;
    IsValid: boolean;
    Fiche_Mat_Fichemateriel: any;
    FicheAch_Lib_PackageAttendu: any;
    Fiche_Mat_LibElementAnnexes: any;
}
