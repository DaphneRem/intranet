import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielModificationInterfaceComponent } from './fiches-materiel-modification-interface.component';

describe('FichesMaterielModificationInterfaceComponent', () => {
  let component: FichesMaterielModificationInterfaceComponent;
  let fixture: ComponentFixture<FichesMaterielModificationInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielModificationInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielModificationInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
