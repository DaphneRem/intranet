import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { SupportSearchComponent } from './support-search.component';
import { SupportSegmentService } from '../services/support-segment.service';

import { Store, StateObservable, StoreModule } from '@ngrx/store';
import { lastSearchInitialState } from './+state/support-search.init';

import { lastSearchReducer } from './+state/support-search.reducer';

const fakeFile = {
    idSupport: '888888',
    numSegment: 0,
    exist: true,
    autoPath : true,
    error : false,
    errorMessage: ''
};

const fakeFileFalse = {
    idSupport: '888888',
    numSegment: 0,
    exist: true,
    autoPath : false,
    error : false,
    errorMessage: ''
};

describe('SupportSearchComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: SupportSearchComponent;
  let fixture: ComponentFixture<SupportSearchComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SupportSearchComponent, TestHostComponent],
        imports: [
          FormsModule,
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule,
          StoreModule.forRoot({}),
          StoreModule.forFeature('lastSearch', lastSearchReducer, {
            initialState: lastSearchInitialState
          }),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          SupportSegmentService,
          {
            provide: Store,
            useValue: lastSearchReducer
          }
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

  it('should have file object', fakeAsync(() => {
    fixture = TestBed.createComponent(SupportSearchComponent);
    component = fixture.componentInstance;
    component.file = fakeFile;
    expect(component.file).toBeDefined();
    expect(typeof component.file).toBe('object');
  }));

  it('should have error object', fakeAsync(() => {
    fixture = TestBed.createComponent(SupportSearchComponent);
    component = fixture.componentInstance;
    expect(component.error).toBeDefined();
    expect(typeof component.error).toBe('object');
  }));

  it('should call checkCurrentRoute() function ngOnInit', fakeAsync( () => {
    spyOn(component, 'checkCurrentRoute');
    component.file = fakeFile;
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.checkCurrentRoute).toHaveBeenCalled();
    });
  }));

  it('should call newSearch() function on new-search button click', fakeAsync( () => {
    fixture = TestBed.createComponent(SupportSearchComponent);
    component = fixture.componentInstance;
    component.file = fakeFile;
    fixture.detectChanges();
    spyOn(component, 'newSearch');
    const searchClass = fixture.debugElement.query(By.css('.new-search'));
    const searchBtn = searchClass.nativeElement;
    searchBtn.click();
    fixture.whenStable().then(() => {
      expect(component.newSearch).toHaveBeenCalled();
    });
  }));

  it('should call checkRouteExist() function on check-route button click', fakeAsync( () => {
    fixture = TestBed.createComponent(SupportSearchComponent);
    component = fixture.componentInstance;
    component.file = fakeFileFalse;
    fixture.detectChanges();
    spyOn(component, 'checkRouteExist');
    const searchClass = fixture.debugElement.query(By.css('.check-route'));
    const searchBtn = searchClass.nativeElement;
    searchBtn.click();
    fixture.whenStable().then(() => {
      expect(component.checkRouteExist).toHaveBeenCalled();
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
    @ViewChild(SupportSearchComponent)
    public SupportSearchComponent: SupportSearchComponent;
  }
});
