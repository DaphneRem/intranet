import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'apps/k-planner/src/app/app-routing.module';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxAllModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarAllModule, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule, MultiSelectAllModule, MultiSelectModule} from '@syncfusion/ej2-angular-dropdowns';
import {
  TreeViewModule,
  TabModule,
  BeforeOpenCloseMenuEventArgs,
  MenuEventArgs,
  MenuItemModel,
  ContextMenuModule
} from '@syncfusion/ej2-angular-navigations';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { TooltipModule, Position, DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns'
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SubHeaderModule } from '@ab/sub-header';
import { MonPlanningComponent } from './kplanner-pages/mon-planning/mon-planning.component';
import { WorkorderDetailsModalComponent } from './workorder-details-modal/workorder-details-modal.component';
import { ListePlanningComponent } from './liste-planning/liste-planning.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadersModule } from '@ab/loaders';
import { ErrorPagesModule } from '@ab/error-pages';
import { KeyboardShortcutComponent } from './keyboard-shortcut/keyboard-shortcut.component';
import { MultiselectWorkorderComponent } from './multiselect-workorder/multiselect-workorder.component';
import { SearchEventsComponent } from './search-events/search-events.component';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DisplayDataSourcePlannerComponent } from './display-data-source-planner/display-data-source-planner.component';



@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ScheduleAllModule,
    RecurrenceEditorAllModule,
    NumericTextBoxAllModule,
    DatePickerAllModule,
    TimePickerAllModule,
    DateTimePickerAllModule,
    CheckBoxAllModule,
    ToolbarAllModule,
    MaskedTextBoxModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    TreeViewModule,
    TabModule,
    ListViewModule,
    SubHeaderModule,
    MatDialogModule,
    MatButtonModule,
    NgbModule,
    FormsModule,
    HttpModule,
    SidebarModule,
    NgbTooltipModule,
    LoadersModule,
    TooltipModule,
    ButtonModule,
    ContextMenuModule,
    ErrorPagesModule,
    AutoCompleteModule,
    MultiSelectModule,
    DialogModule,
    GridAllModule,
    
  ],
  declarations: [
    SchedulerComponent,
    MonPlanningComponent,
    WorkorderDetailsModalComponent,
    ListePlanningComponent,
    FilterPipe,
    KeyboardShortcutComponent,
    MultiselectWorkorderComponent,
    SearchEventsComponent,
    DisplayDataSourcePlannerComponent,
    
    
  ],
  entryComponents: [
    MonPlanningComponent,
    SchedulerComponent,
    WorkorderDetailsModalComponent,

  ]
})
export class KPlannerLibModule {}
