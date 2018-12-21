import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePlanningComponent } from './liste-planning.component';

describe('ListePlanningComponent', () => {
  let component: ListePlanningComponent;
  let fixture: ComponentFixture<ListePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
