import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceSegmentComponent } from './trace-segment.component';

describe('TraceSegmentComponent', () => {
  let component: TraceSegmentComponent;
  let fixture: ComponentFixture<TraceSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
