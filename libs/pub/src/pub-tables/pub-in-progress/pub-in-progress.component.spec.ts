import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PubInProgressComponent } from './pub-in-progress.component';
import { PubInProgressService } from '../../services/pub-in-progress.service';

describe('PubInProgressComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PubInProgressComponent;
  let fixture: ComponentFixture<PubInProgressComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
        declarations: [PubInProgressComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [PubInProgressService]
      }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have headerTableLinkExist property', () => {
    fixture = TestBed.createComponent(PubInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.headerTableLinkExist = true;
    expect(component.headerTableLinkExist).toBeDefined();
  });

  it('should have daysTableView property', () => {
    fixture = TestBed.createComponent(PubInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.daysTableView = 3;
    expect(component.daysTableView).toBeDefined();
  });

  it('should have customdatatablesOptions array with specific property', () => {
    fixture = TestBed.createComponent(PubInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.customdatatablesOptions).toBe('object');
  });

  it('should have customdatatablesOptions tableTitle property to "en cours de traitement"', () => {
    fixture = TestBed.createComponent(PubInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.tableTitle).toBe('en cours de traitement');
  });

  it('should have customdatatablesOptions theme property to "blue theme"', () => {
    fixture = TestBed.createComponent(PubInProgressComponent);
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
    @ViewChild(PubInProgressComponent) public SubHeaderComponent: PubInProgressComponent;
  }

});
