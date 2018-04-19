import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { CustomDatatablesOptions } from '../models/custom-datatables-options';
import { CustomDatatablesComponent } from './custom-datatables.component';
import { constants } from 'fs';

const fakeCustomOptions: CustomDatatablesOptions = {
  tableTitle: 'fake-title',
  data: [],
  headerTableLinkExist: false,
  headerTableLink: 'header-table-link',
  customColumn: false,
  paging: true,
  search: true,
  rowsMax: 10,
  lenghtMenu: [5, 10, 15],
  theme: 'fake theme',
  renderOption: true,
  buttons: {
    buttons: true,
    allButtons: true,
    colvisButtonExiste: true,
    copyButtonExiste: true,
    printButtonExiste: true,
    excelButtonExiste: true
  }
};

const fakeFrenchLanguage = {
    processing: 'Traitement en cours...',
    search: 'Rechercher&nbsp;:',
    lengthMenu: 'Afficher _MENU_ &eacute;l&eacute;ments',
    info: 'Affichage de l\'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
    infoEmpty: 'Affichage de l\'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments',
    infoFiltered: '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
    infoPostFix: '',
    loadingRecords: 'Chargement en cours...',
    zeroRecords: 'Aucun &eacute;l&eacute;ment &agrave; afficher',
    emptyTable: 'Aucune donnée disponible dans le tableau',
    paginate: {
        first: 'Premier',
        previous: 'Pr&eacute;c&eacute;dent',
        next: 'Suivant',
        last: 'Dernier'
    },
    buttons: {
      pageLength: {
          _: 'Afficher %d éléments',
          '-1': 'Tout afficher'
      },
      copyTitle: 'Ajouté au presse-papiers',
      copySuccess: {
        _: '%d lignes copiées',
        1: '1 ligne copiée'
      }
  }
};

describe('CustomDatatablesComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: CustomDatatablesComponent;
  let fixture: ComponentFixture<CustomDatatablesComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CustomDatatablesComponent, TestHostComponent],
        imports : [
          DataTablesModule,
          NgbModule,
          RouterTestingModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have `customdatatablesOptions` object', fakeAsync(() => {
    fixture = TestBed.createComponent(CustomDatatablesComponent);
    component = fixture.componentInstance;
    component.customdatatablesOptions = fakeCustomOptions;
    expect(typeof component.customdatatablesOptions).toBe('object');
  }));

  it('should have title', fakeAsync(() => {
    fixture = TestBed.createComponent(CustomDatatablesComponent);
    component = fixture.componentInstance;
    component.customdatatablesOptions = fakeCustomOptions;
    expect(component.customdatatablesOptions.tableTitle).toBe(fakeCustomOptions.tableTitle);
  }));

  it('should have button options', fakeAsync(() => {
    fixture = TestBed.createComponent(CustomDatatablesComponent);
    component = fixture.componentInstance;
    component.customdatatablesOptions = fakeCustomOptions;
    expect(component.customdatatablesOptions.buttons).toBe(fakeCustomOptions.buttons);
    expect(typeof component.customdatatablesOptions.buttons).toBe('object');
    expect(component.customdatatablesOptions.buttons.buttons).toBe(fakeCustomOptions.buttons.buttons);
    expect(component.customdatatablesOptions.buttons.allButtons).toBe(fakeCustomOptions.buttons.allButtons);
    expect(component.customdatatablesOptions.buttons.colvisButtonExiste).toBe(fakeCustomOptions.buttons.colvisButtonExiste);
    expect(component.customdatatablesOptions.buttons.copyButtonExiste).toBe(fakeCustomOptions.buttons.copyButtonExiste);
    expect(component.customdatatablesOptions.buttons.printButtonExiste).toBe(fakeCustomOptions.buttons.printButtonExiste);
    expect(component.customdatatablesOptions.buttons.excelButtonExiste).toBe(fakeCustomOptions.buttons.excelButtonExiste);
  }));

  it('should custom buttons text', fakeAsync(() => {
    fixture = TestBed.createComponent(CustomDatatablesComponent);
    component = fixture.componentInstance;
    component.colvisButton.text = 'Colonnes';
    component.copyButton.text = 'Copier';
    component.printButton.text = 'Imprimer';
    component.excelButton.text = 'Excel';
    expect(component.colvisButton.text).toBeDefined();
    expect(component.copyButton.text).toBeDefined();
    expect(component.printButton.text).toBeDefined();
    expect(component.excelButton.text).toBeDefined();
  }));

  it('should custom datatable language', fakeAsync(() => {
    fixture = TestBed.createComponent(CustomDatatablesComponent);
    component = fixture.componentInstance;
    component.frenchLanguage = fakeFrenchLanguage;
    expect(component.frenchLanguage).toBeDefined();
  }));

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(CustomDatatablesComponent)
    public CustomDatatablesComponent: CustomDatatablesComponent;
  }
});
