import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffusionsDatesTableComponent } from './diffusions-dates-table/diffusions-dates-table.component';
import { DatesDiffusionsService } from './services/diffusions-dates.service';
import { Http, Response, RequestOptions, URLSearchParams, Headers, HttpModule} from '@angular/http';
import { DataTablesModule } from 'angular-datatables';
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { SubHeaderModule } from '@ab/sub-header';

import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'ng-select';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';



@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    DataTablesModule,
    FormsModule,
    SelectModule,
    MyDateRangePickerModule,
    AngularMultiSelectModule,
    CustomDatatablesModule,
    SubHeaderModule,
    HttpClientModule
  ],
  declarations: [DiffusionsDatesTableComponent],
  providers: [
    DatesDiffusionsService,
    FormBuilder,
    HttpClientModule
  ]
})
export class DiffusionsDatesModule {
}
