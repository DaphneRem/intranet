import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsInProgressDetailsComponent } from './ingests-in-progress-details.component';

describe('IngestsInProgressDetailsComponent', () => {
  let component: IngestsInProgressDetailsComponent;
  let fixture: ComponentFixture<IngestsInProgressDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsInProgressDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsInProgressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
