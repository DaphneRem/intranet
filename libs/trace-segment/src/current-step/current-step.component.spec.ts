import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStepComponent } from './current-step.component';

describe('CurrentStepComponent', () => {
  let component: CurrentStepComponent;
  let fixture: ComponentFixture<CurrentStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
