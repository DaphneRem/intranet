import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'apps/k-planner/src/app/app-routing.module';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule, TabModule } from '@syncfusion/ej2-angular-navigations';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

import { SubHeaderModule } from '@ab/sub-header';
import { MonPlanningComponent } from './kplanner-pages/mon-planning/mon-planning.component';


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
  
  ],
  declarations: [SchedulerComponent, MonPlanningComponent]
})
export class KPlannerLibModule {
}
