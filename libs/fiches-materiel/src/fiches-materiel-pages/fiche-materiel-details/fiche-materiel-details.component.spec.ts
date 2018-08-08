import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheMaterielDetailsComponent } from './fiche-materiel-details.component';

describe('FicheMaterielDetailsComponent', () => {
  let component: FicheMaterielDetailsComponent;
  let fixture: ComponentFixture<FicheMaterielDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheMaterielDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheMaterielDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
