import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesElementsModalComponent } from './annexes-elements-modal.component';

describe('AnnexesElementsModalComponent', () => {
  let component: AnnexesElementsModalComponent;
  let fixture: ComponentFixture<AnnexesElementsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnexesElementsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexesElementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
