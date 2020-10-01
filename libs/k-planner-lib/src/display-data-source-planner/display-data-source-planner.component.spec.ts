import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDataSourcePlannerComponent } from './display-data-source-planner.component';

describe('DisplayDataSourcePlannerComponent', () => {
  let component: DisplayDataSourcePlannerComponent;
  let fixture: ComponentFixture<DisplayDataSourcePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDataSourcePlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDataSourcePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
