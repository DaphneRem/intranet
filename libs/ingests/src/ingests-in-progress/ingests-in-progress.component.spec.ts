import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsInProgressComponent } from './ingests-in-progress.component';

describe('IngestsInProgressComponent', () => {
  let component: IngestsInProgressComponent;
  let fixture: ComponentFixture<IngestsInProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsInProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
