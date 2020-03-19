export class NewObject {
    IdFicheMateriel: any;
    IdFicheAchat: any;
    IdFicheDetail: any;
    Deadline: any;
    SuiviPar: any;
    IdLibstatut: any;
    IdLibEtape: any;
    NumEpisodeProd: any;
    NumEpisodeAB: any;
    TitreEpisodeVF: any;
    TitreEpisodeVO: any;
    IdSupport: any;
    NumProgram: any;
    NumEpisode: any;
    ReceptionAccesLabo: any;
    Renouvellement: any;
    NomLabo: any;
    CoutLabo: any;
    DateLivraison: any;
    DelaiLivraison: any;
    DateRetourOri: any;
    UniteDelaiLivraison: any;
    DateAcceptation: any;
    DatePremiereDiff: any;
    AccesVF: any;
    Commentaires: any;
    RetourOri: any;
    RetourOriDernierDelai: any;
    IdStatutElementsAnnexes: any;
    UserCreation: any;
    UserModification: any;
    DateCreation: any;
    DateModification: any;
    CommentairesDateLivraison: string;
    CommentairesStatutEtape: string;
    isarchived: any;
    Fiche_Mat_ElementsAnnexes?: FichesElementsAnnexes[];
    Fiche_Mat_LibRetourOri?: any;
    Fiche_Mat_LibStatutElementsAnnexes?: any;
    Fiche_Mat_HistoriqueDateLivraison?: any;
    Fiche_Mat_HistoriqueStatutEtape?: any;
    Fiche_Mat_Qualite?: any;
    Fiche_Mat_StatutElementsAnnexes?: any;
    Fiche_Mat_Version?: any;
    debut_des_droits: any;
    expiration_droit: any;
    Isurgence: any;
    Isdeal: any;
}

 export class FichesElementsAnnexes {
    IdElementsAnnexes: number;
    IdFicheMateriel: number;
    IdPackageAttendu: number;
    IsValid: boolean;
    libelle: string;
}

const valueNoChanged = 'Valeur d\'origine';

export const objectNoChanged: NewObject = {
    IdFicheMateriel: valueNoChanged,
    IdFicheAchat: valueNoChanged,
    IdFicheDetail: valueNoChanged,
    Deadline: valueNoChanged,
    SuiviPar: valueNoChanged,
    IdLibstatut: valueNoChanged,
    IdLibEtape: valueNoChanged,
    NumEpisodeProd: valueNoChanged,
    NumEpisodeAB: valueNoChanged,
    TitreEpisodeVF: valueNoChanged,
    TitreEpisodeVO: valueNoChanged,
    IdSupport: valueNoChanged,
    NumProgram: valueNoChanged,
    NumEpisode: valueNoChanged,
    ReceptionAccesLabo: valueNoChanged,
    Renouvellement: valueNoChanged,
    NomLabo: valueNoChanged,
    CoutLabo: valueNoChanged,
    DateLivraison: valueNoChanged,
    DelaiLivraison: valueNoChanged,
    DateRetourOri: valueNoChanged,
    UniteDelaiLivraison: valueNoChanged,
    DateAcceptation: valueNoChanged,
    DatePremiereDiff: valueNoChanged,
    AccesVF: valueNoChanged,
    Commentaires: valueNoChanged,
    RetourOri: valueNoChanged,
    RetourOriDernierDelai: valueNoChanged,
    IdStatutElementsAnnexes: valueNoChanged,
    UserCreation: valueNoChanged,
    UserModification: valueNoChanged,
    DateCreation: valueNoChanged,
    DateModification: valueNoChanged,
    CommentairesDateLivraison: valueNoChanged,
    CommentairesStatutEtape: valueNoChanged,
    isarchived: valueNoChanged,
    debut_des_droits: valueNoChanged,
    expiration_droit: valueNoChanged,
    Isurgence: valueNoChanged,
    Isdeal: valueNoChanged,
  };
