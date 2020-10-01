export class NewFicheMateriel {

    IdFicheAchat: number;
    IdFicheDetail: number;
    Deadline: Date;
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
    isarchived: number;
    DateDebutDroit: Date | string;
    DateFinDroit: Date | string;
    duree_du_pret: number | string;
        constructor(
            {
                IdFicheAchat: IdFicheAchat,
                IdFicheDetail: IdFicheDetail,
                Deadline: Deadline,
                NumEpisodeProd: NumEpisodeProd,
                NumEpisodeAB: NumEpisodeAB,
                TitreEpisodeVF: TitreEpisodeVF,
                TitreEpisodeVO: TitreEpisodeVO,
                IdSupport: IdSupport,
                NumProgram: NumProgram,
                NumEpisode: NumEpisode,
                DateCreation: DateCreation,
                UserCreation: UserCreation,
                SuiviPar: SuiviPar,
                RetourOri: RetourOri,
                duree_du_pret: duree_du_pret
            }
        ) {
            this.IdFicheAchat = IdFicheAchat,
            this.IdFicheDetail = IdFicheDetail,
            this.Deadline = Deadline,
            this.NumEpisodeProd = NumEpisodeProd,
            this.NumEpisodeAB = NumEpisodeAB,
            this.TitreEpisodeVF = TitreEpisodeVF,
            this.TitreEpisodeVO = TitreEpisodeVO,
            this.IdSupport = IdSupport,
            this.NumProgram = NumProgram,
            this.NumEpisode = NumEpisode,
            this.DateCreation = DateCreation,
            this.UserCreation = UserCreation,
            this.SuiviPar = SuiviPar,
            this.RetourOri = RetourOri,
            this.duree_du_pret = duree_du_pret,

            // this.SuiviPar = 'User1', // par défaut : moi
            this.IdLibstatut = 1, // par défaut : 'en cours' (1)
            this.IdLibEtape = 1, // par défaut : '0-non commandé' (1)
            this.ReceptionAccesLabo = '', // par défaut : ''
            this.NomLabo = '', // par défaut : ''
            this.CoutLabo =  0, // par défaut : ''
            this.DateLivraison = '', // par défaut : ''
            this.DateAcceptation = '', // par défaut : ''
            this.DatePremiereDiff =  '', // par défaut : ''
            this.AccesVF = '', // par défaut : ''
            this.Commentaires = '', // par défaut : ''
            // this.RetourOri =  1, // par défaut : à faire (1)
            this.RetourOriDernierDelai = '', // par défaut : ''
            this.IdStatutElementsAnnexes = 1, // par défaut : à faire (1)
            // this.UserCreation = 'User1', // récupéré (par la suite) /!\
            this.UserModification = '', // par défaut : ''
            this.DateModification = null;
            this.isarchived = 0;
            this.DateDebutDroit = null;
            this.DateFinDroit = null;
        }
}
