import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheMaterielDetailsViewComponent } from './fiche-materiel-details-view.component';

describe('FicheMaterielDetailsViewComponent', () => {
  let component: FicheMaterielDetailsViewComponent;
  let fixture: ComponentFixture<FicheMaterielDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheMaterielDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheMaterielDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
