import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielModificationActionComponent } from './fiches-materiel-modification-action.component';

describe('FichesMaterielModificationActionComponent', () => {
  let component: FichesMaterielModificationActionComponent;
  let fixture: ComponentFixture<FichesMaterielModificationActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielModificationActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielModificationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
