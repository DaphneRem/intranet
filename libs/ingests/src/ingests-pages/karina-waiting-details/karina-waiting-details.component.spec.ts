import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KarinaWaitingDetailsComponent } from './karina-waiting-details.component';

describe('KarinaWaitingDetailsComponent', () => {
  let component: KarinaWaitingDetailsComponent;
  let fixture: ComponentFixture<KarinaWaitingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KarinaWaitingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KarinaWaitingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
