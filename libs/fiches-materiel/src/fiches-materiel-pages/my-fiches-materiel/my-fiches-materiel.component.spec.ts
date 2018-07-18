import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { MyFichesMaterielComponent } from './my-fiches-materiel.component';

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

describe('MyFichesMaterielComponent', () => {

  let component: MyFichesMaterielComponent;
  let fixture: ComponentFixture<MyFichesMaterielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFichesMaterielComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFichesMaterielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
