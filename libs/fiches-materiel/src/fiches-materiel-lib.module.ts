import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { FichesAchatLibModule } from '@ab/fiches-achat';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// components pages imports
import { DisplayFichesAchatsComponent } from './fiches-materiel-pages/display-fiches-achats/display-fiches-achats.component';
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import {
  FichesMaterielWidgetViewComponent } from './fiches-materiel-pages/fiches-materiel-widget-view/fiches-materiel-widget-view.component';
import { MyFichesMaterielComponent } from './fiches-materiel-pages/my-fiches-materiel/my-fiches-materiel.component';

// components tables imports
import { FichesAchatTableComponent } from './fiches-achat-table/fiches-achat-table.component';
import { FichesMaterielTableComponent } from './fiches-materiel-tables/fiches-materiel-table/fiches-materiel-table.component';

// components modals imports
import { CreationFichesMaterielComponent } from './creation-modal/creation-fiches-materiel/creation-fiches-materiel.component';
import {
  CreativeFormFichesMaterielComponent } from './creation-modal/creative-form-fiches-materiel/creative-form-fiches-materiel.component';
import { FichesAchatDetailsComponent } from './creation-modal/fiches-achat-details/fiches-achat-details.component';
import { ModalFicheAchatDetailComponent } from './modal-fiche-achat-detail/modal-fiche-achat-detail.component';
import { ModalRecapFicheAchatComponent } from './creation-modal/modal-recap-fiche-achat/modal-recap-fiche-achat.component';

import { SearchFormComponent } from './search-form/search-form.component';
import { FicheMaterielDetailsComponent } from './fiches-materiel-pages/fiche-materiel-details/fiche-materiel-details.component';
import { FicheMaterielDetailsViewComponent } from './fiche-materiel-details-view/fiche-materiel-details-view.component';
import {
  FichesMaterielModificationComponent
} from './fiches-materiel-pages/fiches-materiel-modification/fiches-materiel-modification.component';
import {
  FichesMaterielModificationInterfaceComponent
} from './fiches-materiel-modification-interface/fiches-materiel-modification-interface.component';
import { StoreModule } from '@ngrx/store';
import { ficheMaterielModificationReducer } from './fiches-materiel-modification-interface/+state/fiche-materiel-modification.reducer';
import { ficheMaterielModificationInitialState } from './fiches-materiel-modification-interface/+state/fiche-materiel-modification.init';
import {
  FichesMaterielModificationActionComponent
} from './fiches-materiel-modification-interface/fiches-materiel-modification-action/fiches-materiel-modification-action.component';
import {
  HistoryStepsStatusModalComponent
} from './fiche-materiel-details-view/history-steps-status-modal/history-steps-status-modal.component';
import {
  HistoryDeliveryDateModalComponent
} from './fiche-materiel-details-view/history-delivery-date-modal/history-delivery-date-modal.component';


@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    CustomIconsModule,
    FichesAchatLibModule,
    FormsModule,
    LoadersModule,
    ModalsModule,
    NgbModule,
    SubHeaderModule,
    WidgetsModule,
    StoreModule.forFeature(
      'ficheMaterielModification',
      ficheMaterielModificationReducer,
      { initialState: ficheMaterielModificationInitialState }
    )
  ],
  declarations: [
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DisplayFichesAchatsComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielCreationComponent,
    FicheMaterielDetailsComponent,
    FicheMaterielDetailsViewComponent,
    FichesMaterielModificationComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    HistoryDeliveryDateModalComponent,
    HistoryStepsStatusModalComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    SearchFormComponent,
    FichesMaterielModificationInterfaceComponent,
    FichesMaterielModificationActionComponent,
  ],
  exports: [
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DisplayFichesAchatsComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielCreationComponent,
    FicheMaterielDetailsComponent,
    FichesMaterielModificationComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    HistoryDeliveryDateModalComponent,
    HistoryStepsStatusModalComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    SearchFormComponent
  ]
})
export class FichesMaterielLibModule {}
