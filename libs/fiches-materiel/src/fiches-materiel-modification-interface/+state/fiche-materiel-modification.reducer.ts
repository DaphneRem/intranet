import {FicheMaterielModification} from './fiche-materiel-modification.interfaces';
import {FicheMaterielModificationAction} from './fiche-materiel-modification.actions';

export function ficheMaterielModificationReducer(
  state: FicheMaterielModification,
  action: FicheMaterielModificationAction
): FicheMaterielModification {
  switch (action.type) {
    case 'ADD_FICHE_MATERIEL_IN_MODIF': {
      console.log(state);
      console.log(action.payload);
      state = { ...action.payload };
      return state;
    }
    case 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF': {
      console.log(state);
      console.log(action.payload);
      state = {
        modificationType: '',
        multiFicheAchat: false,
        multiOeuvre: false,
        selectedFichesMateriel: []
      };
      return state;
    }
    default: {
      return state;
    }
  }
}
