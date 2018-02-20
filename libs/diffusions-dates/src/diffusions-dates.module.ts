import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffusionsDatesTableComponent } from './diffusions-dates-table/diffusions-dates-table.component';
import { DatesDiffusionsService } from './services/diffusions-dates.service';
import { Http, Response, RequestOptions, URLSearchParams, Headers, HttpModule  } from '@angular/http';

import { DataTablesModule } from 'angular-datatables';

import {FormsModule} from '@angular/forms';
import {SelectModule} from 'ng-select';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';



@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    DataTablesModule,
    FormsModule,
    SelectModule,
    MyDateRangePickerModule,
    AngularMultiSelectModule
  ],
  declarations: [DiffusionsDatesTableComponent],
  providers: [DatesDiffusionsService]
})
export class DiffusionsDatesModule {
}
