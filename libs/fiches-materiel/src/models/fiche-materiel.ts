export class FicheMateriel {

    IdFicheAchat: number;
    IdFicheDetail: number;
    Deadline: string;
    SuiviPar: string;
    IdLibstatut: number;
    IdLibEtape: number;
    NumEpisodeProd: number;
    NumEpisodeAB: number;
    TitreEpisodeVF: string;
    TitreEpisodeVO: string;
    IdSupport: string;
    NumProgram: string;
    NumEpisode: number;
    ReceptionAccesLabo: string;
    NomLabo: string;
    CoutLabo: number;
    DateLivraison: string;
    DateAcceptation: string;

    DelaiLivraison: any;
    UniteDelaiLivraison: any;

    DatePremiereDiff: string;
    AccesVF: string;
    Commentaires: string;
    RetourOri: number;
    RetourOriDernierDelai: string;
    IdStatutElementsAnnexes: number;
    UserCreation: string;
    UserModification: string;
    DateCreation: Date;
    DateModification: Date;

    DateRetourOri: Date | string;
    Renouvellement: any;
    isarchived: any;
    typefiche: string;
    distributeur: string;
    CommentairesDateLivraison: string;
    CommentairesStatutEtape: string;
    DateDebutDroit: Date | string;
    DateFinDroit: Date | string;
}
