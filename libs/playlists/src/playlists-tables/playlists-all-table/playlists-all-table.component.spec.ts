import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { PlaylistsAllTableComponent } from './playlists-all-table.component';

describe('PlaylistsAllTableComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PlaylistsAllTableComponent;
  let fixture: ComponentFixture<PlaylistsAllTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
      declarations: [ PlaylistsAllTableComponent, TestHostComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
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

  it('should have headerTableLinkExist property', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.headerTableLinkExist = true;
    expect(component.headerTableLinkExist).toBeDefined();
  });

  it('should have daysTableView property', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.daysTableView = 3;
    expect(component.daysTableView).toBeDefined();
  });

  /************ customdatatblesOptions *************/
  it('should have customdatatablesOptions array with specific property', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.customdatatablesOptions).toBe('object');
  });

  it('should have customdatatablesOptions tableTitle property to "playlist"', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.tableTitle).toBe('playlist');
  });

  it('should have customdatatablesOptions theme property to "blue theme"', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.customdatatablesOptions.theme).toBe('blue theme');
  });
  /************************************************/

  /************ VLCustomDatatableOptions *************/
  it('should have VLCustomDatatableOptions array with specific property', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.VLCustomDatatableOptions).toBe('object');
  });

  it('should have VLCustomDatatableOptions tableTitle property to "playlist vl"', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.VLCustomDatatableOptions.tableTitle).toBe('playlist vl');
  });

  it('should have VLCustomDatatableOptions theme property to "blue theme"', () => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.VLCustomDatatableOptions.theme).toBe('blue theme');
  });
  /************************************************/

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
    @ViewChild(PlaylistsAllTableComponent)
    public PlaylistsAllTableComponent: PlaylistsAllTableComponent;
  }
});
