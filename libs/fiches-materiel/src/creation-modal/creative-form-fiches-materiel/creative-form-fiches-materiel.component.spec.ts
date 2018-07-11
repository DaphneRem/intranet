import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFichesMaterielComponent } from './creation-fiches-materiel.component';

describe('CreationFichesMaterielComponent', () => {
  let component: CreationFichesMaterielComponent;
  let fixture: ComponentFixture<CreationFichesMaterielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationFichesMaterielComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationFichesMaterielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
