import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { FichesAchatLibModule } from '@ab/fiches-achat';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// services impots
import { PreviousRouteService } from './services/previous-route-service';

// components pages imports
import { DisplayFichesAchatsComponent } from './fiches-materiel-pages/display-fiches-achats/display-fiches-achats.component';
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import {
  FichesMaterielWidgetViewComponent
} from './fiches-materiel-pages/fiches-materiel-widget-view/fiches-materiel-widget-view.component';
import { MyFichesMaterielComponent } from './fiches-materiel-pages/my-fiches-materiel/my-fiches-materiel.component';
import { MyFichesMaterielAllComponent } from './fiches-materiel-pages/my-fiches-materiel-all/my-fiches-materiel-all.component';
import { MyFichesMaterielArchivedComponent } from './fiches-materiel-pages/my-fiches-materiel-archived/my-fiches-materiel-archived.component';

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
import {
  ExpectedPackageModalComponent
} from './fiche-materiel-details-view/expected-package-modal/expected-package-modal.component';
import {
  AffectedEpisodesModalComponent
} from './fiches-materiel-modification-interface/affected-episodes-modal/affected-episodes-modal.component';
import {
  DeliveryDateCommentModalComponent
} from './fiches-materiel-modification-interface/delivery-date-comment-modal/delivery-date-comment-modal.component';
import {
  StepsStatusCommentModalComponent
} from './fiches-materiel-modification-interface/steps-status-comment-modal/steps-status-comment-modal.component';
import {
  WarningAcceptedStatusComponent
} from './fiches-materiel-modification-interface/warning-accepted-status/warning-accepted-status.component';
import {
  AnnexesElementsModificationModalComponent
} from './fiches-materiel-modification-interface/annexes-elements-modification-modal/annexes-elements-modification-modal.component';
import {
  AnnexesElementsDetailsModalComponent
} from './fiche-materiel-details-view/annexes-elements-details-modal/annexes-elements-details-modal.component';
import { FichesMaterielAllComponent } from './fiches-materiel-pages/fiches-materiel-all/fiches-materiel-all.component';
import { DealInProgressComponent } from './fiches-materiel-pages/deal-in-progress/deal-in-progress.component';


import { datatableFilteredDataInitialState } from './fiches-materiel-tables/fiches-materiel-table/+state/datatable-filtered-data.init';
import { datatableFilteredDataReducer } from './fiches-materiel-tables/fiches-materiel-table/+state/datatable-filtered-data.reducer';

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
    RouterModule,
    StoreModule.forFeature(
      'ficheMaterielModification',
      ficheMaterielModificationReducer,
      { initialState: ficheMaterielModificationInitialState }
    ),
    StoreModule.forFeature(
      'datatableFilteredData',
      datatableFilteredDataReducer,
      { initialState: datatableFilteredDataInitialState }
    )
  ],
  declarations: [
    AffectedEpisodesModalComponent,
    AnnexesElementsModificationModalComponent,
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DeliveryDateCommentModalComponent,
    DisplayFichesAchatsComponent,
    ExpectedPackageModalComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielAllComponent,
    FichesMaterielCreationComponent,
    FicheMaterielDetailsComponent,
    FicheMaterielDetailsViewComponent,
    FichesMaterielModificationComponent,
    FichesMaterielModificationActionComponent,
    FichesMaterielModificationInterfaceComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    HistoryDeliveryDateModalComponent,
    HistoryStepsStatusModalComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    MyFichesMaterielAllComponent,
    MyFichesMaterielArchivedComponent,
    SearchFormComponent,
    StepsStatusCommentModalComponent,
    WarningAcceptedStatusComponent,
    AnnexesElementsDetailsModalComponent,
    DealInProgressComponent,
  ],
  exports: [
    AffectedEpisodesModalComponent,
    AnnexesElementsModificationModalComponent,
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DealInProgressComponent,
    DisplayFichesAchatsComponent,
    DeliveryDateCommentModalComponent,
    ExpectedPackageModalComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielAllComponent,
    FichesMaterielCreationComponent,
    FicheMaterielDetailsComponent,
    FicheMaterielDetailsViewComponent,
    FichesMaterielModificationComponent,
    FichesMaterielModificationActionComponent,
    FichesMaterielModificationInterfaceComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    HistoryDeliveryDateModalComponent,
    HistoryStepsStatusModalComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    MyFichesMaterielAllComponent,
    MyFichesMaterielArchivedComponent,
    SearchFormComponent,
    StepsStatusCommentModalComponent,
    WarningAcceptedStatusComponent,
    AnnexesElementsDetailsModalComponent
  ],
  providers: [
    PreviousRouteService
  ]
})
export class FichesMaterielLibModule {}
