import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsCompletedDetailsComponent } from './ingests-completed-details.component';

describe('IngestsCompletedDetailsComponent', () => {
  let component: IngestsCompletedDetailsComponent;
  let fixture: ComponentFixture<IngestsCompletedDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsCompletedDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsCompletedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
