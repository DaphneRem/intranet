import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielArchivedComponent } from './fiches-materiel-archived.component';

describe('FichesMaterielArchivedComponent', () => {
  let component: FichesMaterielArchivedComponent;
  let fixture: ComponentFixture<FichesMaterielArchivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielArchivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
