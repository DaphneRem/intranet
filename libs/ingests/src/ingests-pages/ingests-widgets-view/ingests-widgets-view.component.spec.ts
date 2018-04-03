import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view.component';

describe('IngestsWidgetsViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: IngestsWidgetsViewComponent;
  let fixture: ComponentFixture<IngestsWidgetsViewComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IngestsWidgetsViewComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('should have link property to "./tables-view"', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.link).toBe('./tables-view');
  });

  it('should have widgets array consisting of 4 objects', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.widgets).toBe('object');
    expect(component.widgets.length).toBe(4);
    expect(typeof component.widgets[0]).toBe('object');
  });

  it('should have widget "En cours de traitement" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[0].title).toBe('En cours de traitement');
    expect(component.widgets[0].icon).toBe('icofont icofont-spinner-alt-6');
    expect(component.widgets[0].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[0].link).toBe('./in-progress');
    expect(component.widgets[0].color).toBe('#39ADB5');
  });

  it('should have widget "Terminés" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[1].title).toBe('Terminés');
    expect(component.widgets[1].icon).toBe('icofont icofont-check-alt');
    expect(component.widgets[1].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[1].link).toBe('./completed');
    expect(component.widgets[1].color).toBe('#17B978');
  });

  it('should have widget "En attente KAI" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[2].title).toBe('En attente KAI');
    expect(component.widgets[2].icon).toBe('icofont icofont-wall-clock');
    expect(component.widgets[2].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[2].link).toBe('./kai-waiting');
    expect(component.widgets[2].color).toBe('#FF5F5F');
  });

  it('should have widget "En attente KARINA" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(IngestsWidgetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[3].title).toBe('En attente KARINA');
    expect(component.widgets[3].icon).toBe('icofont icofont-wall-clock');
    expect(component.widgets[3].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[3].link).toBe('./karina-waiting');
    expect(component.widgets[3].color).toBe('#FDB44B');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(IngestsWidgetsViewComponent)
    public IngestsWidgetsViewComponent: IngestsWidgetsViewComponent;
  }
});
