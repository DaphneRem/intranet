import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { PlaylistsWidgetsViewComponent } from './playlists-widgets-view.component';

describe('PlaylistsWidgetsViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PlaylistsWidgetsViewComponent;
  let fixture: ComponentFixture<PlaylistsWidgetsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsWidgetsViewComponent, TestHostComponent],
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

  it('should have link property to "./tables-view"', () => {
    fixture = TestBed.createComponent(PlaylistsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.link).toBe('./tables-view');
  });

  it('should have widgets array consisting of 2 objects', () => {
    fixture = TestBed.createComponent(PlaylistsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.widgets).toBe('object');
    expect(component.widgets.length).toBe(2);
    expect(typeof component.widgets[0]).toBe('object');
  });

  it('should have widget "En cours de traitement" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(PlaylistsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[0].title).toBe('Erreurs Playlist');
    expect(component.widgets[0].icon).toBe('icofont icofont-warning-alt');
    expect(component.widgets[0].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[0].link).toBe('./errors');
    expect(component.widgets[0].color).toBe('#FF0000');
  });

  it('should have widget "Terminés" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(PlaylistsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[1].title).toBe('Toutes les Playlists');
    expect(component.widgets[1].icon).toBe('icofont icofont-youtube-play');
    expect(component.widgets[1].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[1].link).toBe('./all');
    expect(component.widgets[1].color).toBe('#39ADB5');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PlaylistsWidgetsViewComponent) public SubHeaderComponent: PlaylistsWidgetsViewComponent;
  }

});
