import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFicheAchatDetailComponent } from './modal-fiche-achat-detail.component';

describe('ModalFicheAchatDetailComponent', () => {
  let component: ModalFicheAchatDetailComponent;
  let fixture: ComponentFixture<ModalFicheAchatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFicheAchatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFicheAchatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
