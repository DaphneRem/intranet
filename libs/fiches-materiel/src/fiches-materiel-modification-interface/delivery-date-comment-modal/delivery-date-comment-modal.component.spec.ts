import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDateCommentModalComponent } from './delivery-date-comment-modal.component';

describe('DeliveryDateCommentModalComponent', () => {
  let component: DeliveryDateCommentModalComponent;
  let fixture: ComponentFixture<DeliveryDateCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryDateCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDateCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
