import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { PubWidgetsViewComponent } from './pub-widgets-view.component';

describe('PubWidgetsViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PubWidgetsViewComponent;
  let fixture: ComponentFixture<PubWidgetsViewComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [PubWidgetsViewComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have link property to "./tables-view"', () => {
    fixture = TestBed.createComponent(PubWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.link).toBe('./tables-view');
  });

  it('should have widgets array consisting of 2 objects', () => {
    fixture = TestBed.createComponent(PubWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.widgets).toBe('object');
    expect(component.widgets.length).toBe(2);
    expect(typeof component.widgets[0]).toBe('object');
  });

  it('should have widget "En cours de traitement" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(PubWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[0].title).toBe('En cours de traitement');
    expect(component.widgets[0].icon).toBe('icofont icofont-spinner-alt-6');
    expect(component.widgets[0].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[0].link).toBe('./in-progress');
    expect(component.widgets[0].color).toBe('#39ADB5');
  });

  it('should have widget "Terminés" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(PubWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[1].title).toBe('Terminés');
    expect(component.widgets[1].icon).toBe('icofont icofont-check-alt');
    expect(component.widgets[1].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[1].link).toBe('./completed');
    expect(component.widgets[1].color).toBe('#17B978');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PubWidgetsViewComponent) public SubHeaderComponent: PubWidgetsViewComponent;
  }

});
