import { FicheMaterielModification } from './fiche-materiel-modification.interfaces';

export const ficheMaterielModificationInitialState: FicheMaterielModification = {
  modificationType: '',
  multiFicheAchat: false,
  multiOeuvre: false,
  allOeuvres: [],
  allFichesAchat: [],
  selectedFichesMateriel: []
};
