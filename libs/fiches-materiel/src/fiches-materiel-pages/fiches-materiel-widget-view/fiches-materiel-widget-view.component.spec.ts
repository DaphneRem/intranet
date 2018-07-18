import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { FichesMaterielWidgetViewComponent } from './fiches-materiel-widget-view.component';

describe('FichesMaterielWidgetViewComponent', () => {
  let component: FichesMaterielWidgetViewComponent;
  let fixture: ComponentFixture<FichesMaterielWidgetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielWidgetViewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have widgets array consisting of 4 objects', () => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(typeof component.widgets).toBe('object');
    expect(component.widgets.length).toBe(4);
    expect(typeof component.widgets[0]).toBe('object');
  });

  it('should have widget "Mes Fiches Matériel en cours" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[0].title).toBe('Mes Fiches Matériel en cours');
    expect(component.widgets[0].icon).toBe('icofont icofont-spinner-alt-6');
    expect(component.widgets[0].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[0].link).toBe('./my-material-sheets');
    expect(component.widgets[0].color).toBe('#39ADB5');
  });

  it('should have widget "Mes Fiches Matériel archivées" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[1].title).toBe('Mes Fiches Matériel archivées');
    expect(component.widgets[1].icon).toBe('icofont icofont-check-alt');
    expect(component.widgets[1].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[1].link).toBe('./all');
    expect(component.widgets[1].color).toBe('#17B978');
  });

  it('should have widget "Toutes mes Fiches Matériel" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[2].title).toBe('Toutes mes Fiches Matériel');
    expect(component.widgets[2].icon).toBe('icofont icofont-file-text');
    expect(component.widgets[2].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[2].link).toBe('./all');
    expect(component.widgets[2].color).toBe('#5ED4FF');
  });

  it('should have widget "Toutes les Fiches Matériel" with specific title, icon, size, link and color', () => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.widgets[3].title).toBe('Toutes les Fiches Matériel');
    expect(component.widgets[3].icon).toBe('icofont icofont-file-text');
    expect(component.widgets[3].size).toBe('col-md-12 col-lg-6 ');
    expect(component.widgets[3].link).toBe('./all');
    expect(component.widgets[3].color).toBe('#1C2799');
  });

});
