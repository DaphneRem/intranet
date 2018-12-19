import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// component import
import { FichesMaterielTableComponent } from './fiches-materiel-table.component';

// services import
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FichesAchatService } from '@ab/fiches-achat';

describe('FichesMaterielTableComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: FichesMaterielTableComponent;
  let fixture: ComponentFixture<FichesMaterielTableComponent>;


  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
        declarations: [
          FichesMaterielTableComponent,
          TestHostComponent
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          FichesMaterielService,
          FichesAchatService
        ]
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

  it('should have headerTableLinkExist property', () => {
    fixture = TestBed.createComponent(FichesMaterielTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.headerTableLinkExist = true;
    expect(component.headerTableLinkExist).toBeDefined();
  });


  it('should have customdatatablesOptions array with specific property', () => {
    fixture = TestBed.createComponent(FichesMaterielTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.customdatatablesOptions).toBe('object');
  });

  it('should have customdatatablesOptions tableTitle property to "Fiches Materiel"', () => {
    fixture = TestBed.createComponent(FichesMaterielTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.tableTitle).toBe('Fiches Materiel');
  });

  it('should have customdatatablesOptions theme property to "blue theme"', () => {
    fixture = TestBed.createComponent(FichesMaterielTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.theme).toBe('blue theme');
  });

  it('should issue a request', async(
      inject(
        [HttpClient, HttpTestingController],
        (http: HttpClient, backend: HttpTestingController) => {
          http.get('/foo/bar').subscribe();
          backend.expectOne({
            url: '/foo/bar',
            method: 'GET'
          });
        }
      )
    )
  );

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(FichesMaterielTableComponent)
    public IngestsPurgedComponent: FichesMaterielTableComponent;
  }
});
