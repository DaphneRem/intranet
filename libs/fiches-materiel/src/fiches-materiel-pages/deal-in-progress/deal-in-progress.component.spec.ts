import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealInProgressComponent } from './deal-in-progress.component';

describe('DealInProgressComponent', () => {
  let component: DealInProgressComponent;
  let fixture: ComponentFixture<DealInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
