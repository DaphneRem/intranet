import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningAcceptedStatusComponent } from './warning-accepted-status.component';

describe('WarningAcceptedStatusComponent', () => {
  let component: WarningAcceptedStatusComponent;
  let fixture: ComponentFixture<WarningAcceptedStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningAcceptedStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningAcceptedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
