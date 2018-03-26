import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepInProcessComponent } from './step-in-process.component';

describe('StepInProcessComponent', () => {
  let component: StepInProcessComponent;
  let fixture: ComponentFixture<StepInProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepInProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });
});
