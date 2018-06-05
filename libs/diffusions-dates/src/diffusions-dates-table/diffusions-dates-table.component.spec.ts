// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild, Inject } from '@angular/core';
// import { DiffusionsDatesTableComponent } from './diffusions-dates-table.component';
// import { RouterModule } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DatesDiffusionsService } from '../services/diffusions-dates.service';
// import { HttpHandler } from '@angular/common/http';
// import {
//   HttpClientModule,
//   HttpClient,
//   HttpHeaders,
//   HttpErrorResponse
// } from '@angular/common/http';

// describe('Component: DiffusionsDatesTableComponent', () => {

//   let component: DiffusionsDatesTableComponent;
//   let fixture: ComponentFixture<DiffusionsDatesTableComponent>;
//   let dataFormTest = { "channels": [ { "id": 1, "itemName": "AB 1" }, { "id": 19, "itemName": "AB 3" } ], "type": "Conducteur", "programName": "2015-00953", "datesRange": { "date1": "2017-12-31T23:00:00.000Z", "date2": "2018-03-30T22:00:00.000Z" } };
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ DiffusionsDatesTableComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
//       imports: [RouterModule, FormsModule, ReactiveFormsModule ],
//       providers: [DatesDiffusionsService, HttpClient, HttpHandler]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DiffusionsDatesTableComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', async(() => {
//     expect(component).toBeTruthy();
//   }));

//   it('numProgramValidator valid', () => {
//     dataFormTest.programName = '2015-00953';
//     component.datasForm = dataFormTest;
//     expect(component.numProgramValidator()).toBeTruthy();
//   });
//   it('numProgramValidator detect date < 1996 ', () => {
//     dataFormTest.programName = '1980-00953';
//     component.datasForm = dataFormTest;
//     expect(component.numProgramValidator()).toBeFalsy();
//   });
//   it('numProgramValidator detect date sans tiret ', () => {
//     dataFormTest.programName = '198000953';
//     component.datasForm = dataFormTest;
//     expect(component.numProgramValidator()).toBeFalsy();
//   });
//   it('numProgramValidator detect date vide ', () => {
//     dataFormTest.programName = '';
//     component.datasForm = dataFormTest;
//     expect(component.numProgramValidator()).toBeFalsy();
//   });
//   it('formInputsTest detect liste choix chaines vide', () => {
//     dataFormTest.channels = [];
//     component.datasForm = dataFormTest;
//     expect(component.formInputsTest()).toBeFalsy();
//   });
//   it('formInputsTest detect datesRange abscent dans l objet date', () => {
//     delete dataFormTest.channels['datesRange'];
//     component.datasForm = dataFormTest;
//     expect(component.formInputsTest()).toBeFalsy();
//   });


//   /*

//   it('convertTime function ', () => {
//     expect(component.convertTime(3600, 30)).toBe('108000');
//   });
//   // test Fonction validation numero de programme

//   const datasForm = {
//     'channels': [
//       { 'id': 0, 'itemName': 'LIBRE' },
//       { 'id': 1, 'itemName': 'AB 1' } ],
//       'type': 'Grille',
//       'datesRange': { 'date1': '2017-12-01T23:00:00.000Z', 'date2': '2017-12-15T23:00:00.000Z' },
//       'programName': '1994-12345'
//     };

//   it('Test fonction validation numero programme', () => {
//     expect(component.numProgramValidator).toBe(false, 'date renseignée > avant 1996');
//   });
// */

// });
