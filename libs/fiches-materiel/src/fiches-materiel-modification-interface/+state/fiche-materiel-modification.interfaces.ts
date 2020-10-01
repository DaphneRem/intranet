export interface FicheMaterielModification {
  modificationType: string;
  multiFicheAchat: boolean;
  multiOeuvre: boolean;
  allOeuvres: number[];
  allFichesAchat: number[];
  selectedFichesMateriel: FichesMaterielSelectioned[];
}

export interface FichesMaterielSelectioned {
  idFicheMateriel: string;
  idFicheAchat: string;
  idFicheAchatDetail: string;
}

export interface FicheMaterielModificationState {
  readonly ficheMaterielModification: FicheMaterielModification;
}
