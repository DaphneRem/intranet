import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielModificationComponent } from './fiches-materiel-modification.component';

describe('FichesMaterielModificationComponent', () => {
  let component: FichesMaterielModificationComponent;
  let fixture: ComponentFixture<FichesMaterielModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
