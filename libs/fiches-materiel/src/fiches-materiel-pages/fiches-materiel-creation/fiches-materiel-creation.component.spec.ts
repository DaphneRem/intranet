import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { FichesMaterielCreationComponent } from './fiches-materiel-creation.component';

import { CustomIconBadge } from '@ab/custom-icons';

const iconTesting = {
      littleIcon : {
        circleColor: '#3383FF',
        icon : 'icofont icofont-eye',
        iconSize: '1.5em',
        iconMargin: '2px',
      },
      bigIcon : {
        icon: 'icofont icofont-file-text',
        circleColor:  '#999898',
      },
      link : '../material-sheets/my-material-sheets'
};

describe('FichesMaterielCreationComponent', () => {
  let component: FichesMaterielCreationComponent;
  let fixture: ComponentFixture<FichesMaterielCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielCreationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a fichesMaterielView object', () => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    component.fichesMaterielView = iconTesting;
    expect(component.fichesMaterielView).toBeDefined();
  });

  it('should have a fichesAchatView object', () => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    component.fichesAchatView = iconTesting;
    expect(component.fichesAchatView).toBeDefined();
  });

  it('should have headerTableLinkExist property', () => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    component.headerTableLinkExist = true;
    expect(component.headerTableLinkExist).toBeDefined();
  });

  it('should have displayActionType property', () => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    component.displayActionType = 'modal';
    expect(component.headerTableLinkExist).toBeDefined();
  });


});
