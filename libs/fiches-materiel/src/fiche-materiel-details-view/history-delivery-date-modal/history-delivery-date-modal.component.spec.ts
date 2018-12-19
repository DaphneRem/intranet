import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDeliveryDateModalComponent } from './history-delivery-date-modal.component';

describe('HistoryDeliveryDateModalComponent', () => {
  let component: HistoryDeliveryDateModalComponent;
  let fixture: ComponentFixture<HistoryDeliveryDateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDeliveryDateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDeliveryDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
