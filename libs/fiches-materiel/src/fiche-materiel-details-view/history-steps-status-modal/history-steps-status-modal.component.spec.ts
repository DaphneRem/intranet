import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStepsStatusModalComponent } from './history-steps-status-modal.component';

describe('HistoryStepsStatusModalComponent', () => {
  let component: HistoryStepsStatusModalComponent;
  let fixture: ComponentFixture<HistoryStepsStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryStepsStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryStepsStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
