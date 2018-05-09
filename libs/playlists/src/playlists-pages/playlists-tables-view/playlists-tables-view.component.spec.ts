
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { PlaylistsTablesViewComponent } from './playlists-tables-view.component';

describe('PlaylistsTablesViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PlaylistsTablesViewComponent;
  let fixture: ComponentFixture<PlaylistsTablesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsTablesViewComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('should have link property', () => {
    fixture = TestBed.createComponent(PlaylistsTablesViewComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should have link property', () => {
    fixture = TestBed.createComponent(PlaylistsTablesViewComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  // it('should display view for 24h', () => {
  //   fixture = TestBed.createComponent(PlaylistsTablesViewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.daysTableView).toBe(1);
  // });

  // it('should have headerTableLinkExist property to true', () => {
  //   fixture = TestBed.createComponent(PubTablesViewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.headerTableLinkExist).toBe(true);
  // });

  // it('should have inProgressTableLink link to "../in-progress" ', () => {
  //   fixture = TestBed.createComponent(PlaylistsTablesViewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.inProgressTableLink).toBe('../in-progress');
  // });

  // it('should have completedTableLink link to "../completed" ', () => {
  //   fixture = TestBed.createComponent(PlaylistsTablesViewComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(component.completedTableLink).toBe('../completed');
  // });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PlaylistsTablesViewComponent) public SubHeaderComponent: PlaylistsTablesViewComponent;
  }

});
