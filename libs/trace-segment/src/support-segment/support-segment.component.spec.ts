import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSegmentComponent } from './support-segment.component';

describe('SupportSegmentComponent', () => {
  let component: SupportSegmentComponent;
  let fixture: ComponentFixture<SupportSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
