import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalRecapFicheAchatComponent } from './modal-recap-fiche-achat.component';

describe('ModalRecapFicheAchatComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: ModalRecapFicheAchatComponent;
  let fixture: ComponentFixture<ModalRecapFicheAchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        ModalRecapFicheAchatComponent,
        TestHostComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have init property to equal 1', () => {
    fixture = TestBed.createComponent(ModalRecapFicheAchatComponent);
    component = fixture.componentInstance;
    expect(component.init).toEqual(1);
  });

  it('should have step property to equal 1', () => {
    fixture = TestBed.createComponent(ModalRecapFicheAchatComponent);
    component = fixture.componentInstance;
    expect(component.step).toEqual(1);
  });

  it('should have series and seriesExist properties', () => {
    fixture = TestBed.createComponent(ModalRecapFicheAchatComponent);
    component = fixture.componentInstance;
    component.series = [];
    component.seriesExist = false;
    expect(component.series).toBeDefined();
    expect(component.seriesExist).toBeDefined();
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
    @ViewChild(ModalRecapFicheAchatComponent)
    public ModalRecapFicheAchatComponent: ModalRecapFicheAchatComponent;
  }
});
