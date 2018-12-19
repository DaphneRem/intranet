import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { SupportSegmentComponent } from './support-segment.component';
import { SupportSegmentService } from '../services/support-segment.service';

const fakeFile = {
    idSupport: '888888',
    numSegment: 0,
    exist: true,
    autoPath : true,
    error : false,
    errorMessage: ''
};

describe('SupportSegmentComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: SupportSegmentComponent;
  let fixture: ComponentFixture<SupportSegmentComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SupportSegmentComponent, TestHostComponent],
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [SupportSegmentService]
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

  it('should have file object', fakeAsync(() => {
    fixture = TestBed.createComponent(SupportSegmentComponent);
    component = fixture.componentInstance;
    component.file = fakeFile;
    expect(component.file).toBeDefined();
    expect(typeof component.file).toBe('object');
  }));

  it('should have minHeight property to 210', () => {
    fixture = TestBed.createComponent(SupportSegmentComponent);
    component = fixture.componentInstance;
    expect(component.minHeight).toBe(210);
  });

  it('should have displayWidgetData() function', () => {
    fixture = TestBed.createComponent(SupportSegmentComponent);
    component = fixture.componentInstance;
    expect(component.displayWidgetData).toBeDefined();
  });

  it('should call getSupportSegment() function ngOnInit', fakeAsync( () => {
    spyOn(component, 'getSupportSegment');
    component.file = fakeFile;
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.getSupportSegment).toHaveBeenCalled();
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
    @ViewChild(SupportSegmentComponent)
    public SupportSegmentComponent: SupportSegmentComponent;
  }
});
