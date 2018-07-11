import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecapFicheAchatComponent } from './modal-recap-fiche-achat.component';

describe('ModalRecapFicheAchatComponent', () => {
  let component: ModalRecapFicheAchatComponent;
  let fixture: ComponentFixture<ModalRecapFicheAchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecapFicheAchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecapFicheAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
