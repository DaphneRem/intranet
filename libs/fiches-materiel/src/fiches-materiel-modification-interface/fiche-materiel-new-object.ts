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

}

 export class FichesElementsAnnexes {
    IdElementsAnnexes: number;
    IdFicheMateriel: number;
    IdPackageAttendu: number;
    IsValid: boolean;
    libelle: string;
}
