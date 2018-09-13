import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

@Component({
  selector: 'fiches-materiel-modification-interface',
  templateUrl: './fiches-materiel-modification-interface.component.html',
  styleUrls: ['./fiches-materiel-modification-interface.component.scss'],
  providers : [
    Store
  ]
})
export class FichesMaterielModificationInterfaceComponent implements OnInit, OnDestroy {
  public globalStore;
  public storeFichesToModif;

  constructor(
    private store: Store<FicheMaterielModification>
  ) { }

  ngOnInit() {
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF', payload: {}
    });
  }

}
