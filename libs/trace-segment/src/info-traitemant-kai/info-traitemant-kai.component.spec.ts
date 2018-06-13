import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InfoTraitemantKaiComponent } from './info-traitemant-kai.component';
import { InformationsKaiService } from '../services/informations-kai.service';

describe('InfoTraitemantKaiComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: InfoTraitemantKaiComponent;
  let fixture: ComponentFixture<InfoTraitemantKaiComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          HttpClientTestingModule
        ],
        declarations: [
          InfoTraitemantKaiComponent,
          TestHostComponent
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [InformationsKaiService]
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

  it('should have minHeight property to 155', () => {
    fixture = TestBed.createComponent(InfoTraitemantKaiComponent);
    component = fixture.componentInstance;
    expect(component.minHeight).toBe(155);
  });

  it('should call getInformationsKai() function ngOnInit', fakeAsync( () => {
    fixture = TestBed.createComponent(InfoTraitemantKaiComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getInformationsKai');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.getInformationsKai).toHaveBeenCalled();
    });
  }));

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
    @ViewChild(InfoTraitemantKaiComponent)
    public InfoTraitemantKaiComponent: InfoTraitemantKaiComponent;
  }
});
