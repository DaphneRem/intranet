import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

@Component({
  selector: 'fiches-materiel-modification-interface',
  templateUrl: './fiches-materiel-modification-interface.component.html',
  styleUrls: ['./fiches-materiel-modification-interface.component.scss'],
  providers : [
    FichesAchatService,
    FichesMaterielService,
    Store
  ]
})
export class FichesMaterielModificationInterfaceComponent implements OnInit, OnDestroy {
  public globalStore;
  public storeFichesToModif;

  public allFichesMateriel = [];
  public dataIdFicheMaterielReady = false;
  public newObject = {
    IdFicheMateriel: 'value-not-to-change',
    IdFicheAchat: 'value-not-to-change',
    IdFicheDetail: 'value-not-to-change',
    Deadline: 'value-not-to-change',
    SuiviPar: 'value-not-to-change',
    IdLibstatut: 'value-not-to-change',
    IdLibEtape: 'value-not-to-change',
    NumEpisodeProd: 'value-not-to-change',
    NumEpisodeAB: 'value-not-to-change',
    TitreEpisodeVF: 'value-not-to-change',
    TitreEpisodeVO: 'value-not-to-change',
    IdSupport: 'value-not-to-change',
    NumProgram: 'value-not-to-change',
    NumEpisode: 'value-not-to-change',
    ReceptionAccesLabo: 'value-not-to-change',
    NomLabo: 'value-not-to-change',
    CoutLabo: 'value-not-to-change',
    DateLivraison: 'value-not-to-change',
    DelaiLivraison: 'value-not-to-change',
    UniteDelaiLivraison: 'value-not-to-change',
    DateAcceptation: 'value-not-to-change',
    DatePremiereDiff: 'value-not-to-change',
    AccesVF: 'value-not-to-change',
    Commentaires: 'value-not-to-change',
    RetourOri: 'value-not-to-change',
    RetourOriDernierDelai: 'value-not-to-change',
    IdStatutElementsAnnexes: 'value-not-to-change',
    UserCreation: 'value-not-to-change',
    UserModification: 'value-not-to-change',
    DateCreation: 'value-not-to-change',
    DateModification: 'value-not-to-change',
    Fiche_Mat_ElementsAnnexes: 'value-not-to-change',
    Fiche_Mat_LibEtape: 'value-not-to-change',
    Fiche_Mat_LibRetourOri: 'value-not-to-change',
    Fiche_Mat_Libstatut: 'value-not-to-change',
    Fiche_Mat_LibStatutElementsAnnexes: 'value-not-to-change',
    Fiche_Mat_HistoriqueDateLivraison: 'value-not-to-change',
    Fiche_Mat_HistoriqueStatutEtape: 'value-not-to-change',
    Fiche_Mat_Qualite: 'value-not-to-change',
    Fiche_Mat_StatutElementsAnnexes: 'value-not-to-change',
    Fiche_Mat_Version: 'value-not-to-change',
  };

  constructor(
    private fichesAchatService: FichesAchatService,
    private fichesMaterielService: FichesMaterielService,
    private store: Store<FicheMaterielModification>
  ) { }

  ngOnInit() {
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
    this.getAllFichesMateriel(this.storeFichesToModif.selectedFichesMateriel);
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF', payload: {}
    });
  }

  getAllFichesMateriel(allIdFichesMateriel) {
    allIdFichesMateriel.map((item) => {
      console.log(item);
      this.getFicheMateriel(item.idFicheMateriel, allIdFichesMateriel.indexOf(item), allIdFichesMateriel.length);
    });
  }

  displayNewObject(length, ficheMateriel) {
    if (length === 1) {
      this.newObject = ficheMateriel;
      console.log(this.newObject);
    }
  }


  getFicheMateriel(id: number, index, length) {
    console.log(index);
    console.log(length);
    this.fichesMaterielService
      .getOneFicheMateriel(id)
      .subscribe(data => {
        if (data) {
          this.allFichesMateriel.push(data[0]);
          if (index === (length - 1)) {
            this.displayNewObject(length, data[0]);
            this.dataIdFicheMaterielReady = true;
          }
        }
      });
      console.log(this.allFichesMateriel);
  }


}
