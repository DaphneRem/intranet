import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsCompletedComponent } from './ingests-completed.component';

describe('IngestsCompletedComponent', () => {
  let component: IngestsCompletedComponent;
  let fixture: ComponentFixture<IngestsCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
