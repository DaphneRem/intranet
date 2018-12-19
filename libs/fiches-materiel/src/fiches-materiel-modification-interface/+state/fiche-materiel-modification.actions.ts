export interface AddFichesMaterielInModif {
  type: 'ADD_FICHE_MATERIEL_IN_MODIF';
  payload: {
    modificationType: '',
    multiFicheAchat: false,
    multiOeuvre: false,
    selectedFichesMateriel: [
      {
        idFicheMateriel: string;
        idFicheAchat: string;
        idFicheAchatDetail: string;
      }
    ];
  };
}

export interface DeleteAllFichesMaterielInModif {
  type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF';
  payload: {};
}

export type FicheMaterielModificationAction = AddFichesMaterielInModif | DeleteAllFichesMaterielInModif;

