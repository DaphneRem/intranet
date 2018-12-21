import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderDetailsModalComponent } from './workorder-details-modal.component';

describe('WorkorderDetailsModalComponent', () => {
  let component: WorkorderDetailsModalComponent;
  let fixture: ComponentFixture<WorkorderDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
