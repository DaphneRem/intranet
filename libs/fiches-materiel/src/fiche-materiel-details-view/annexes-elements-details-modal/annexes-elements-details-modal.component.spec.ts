import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesElementsDetailsModalComponent } from './annexes-elements-details-modal.component';

describe('AnnexesElementsDetailsModalComponent', () => {
  let component: AnnexesElementsDetailsModalComponent;
  let fixture: ComponentFixture<AnnexesElementsDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnexesElementsDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexesElementsDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
