import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { KaiWaitingComponent } from './kai-waiting.component';
import { KaiWaitingService } from "../services/kai-waiting.service";

describe('KaiWaitingComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: KaiWaitingComponent;
  let fixture: ComponentFixture<KaiWaitingComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          HttpClientTestingModule
        ],
        declarations: [
          KaiWaitingComponent,
          TestHostComponent
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [KaiWaitingService]
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
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.headerTableLinkExist = true;
    expect(component.headerTableLinkExist).toBeDefined();
  });

  it('should have daysTableView property', () => {
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.daysTableView = 3;
    expect(component.daysTableView).toBeDefined();
  });

  it('should have customdatatablesOptions array with specific property', () => {
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.customdatatablesOptions).toBe('object');
  });

  it('should have customdatatablesOptions tableTitle property to "en attente Kai"', () => {
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.tableTitle).toBe('en attente Kai');
  });

  it('should have customdatatablesOptions theme property to "red theme"', () => {
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.theme).toBe('red theme');
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
    @ViewChild(KaiWaitingComponent)
    public KaiWaitingComponent: KaiWaitingComponent;
  }
});
