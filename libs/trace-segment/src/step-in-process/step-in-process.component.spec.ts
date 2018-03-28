import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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

  it('should have step object with inProgress, karina, kai and completed property', () => {
    fixture.detectChanges();
    expect(typeof component.step).toBe('object');
    expect(component.step.inProgress).toBeDefined();
    expect(component.step.karina).toBeDefined();
    expect(component.step.kai).toBeDefined();
    expect(component.step.completed).toBeDefined();
  });

  it('should have valid, active, activeRoundColor and activeTextColor property for step InProcess', () => {
    fixture.detectChanges();
    expect(typeof component.step.inProgress).toBe('object');
    expect(component.step.inProgress.valid).toBeDefined();
    expect(component.step.inProgress.active).toBeDefined();
    expect(component.step.inProgress.activeRoundColor).toBeDefined();
    expect(component.step.inProgress.activeTextColor).toBeDefined();
  });

  it('should have valid, active, activeRoundColor and activeTextColor property for step Karina', () => {
    fixture.detectChanges();
    expect(typeof component.step.karina).toBe('object');
    expect(component.step.karina.valid).toBeDefined();
    expect(component.step.karina.active).toBeDefined();
    expect(component.step.karina.activeRoundColor).toBeDefined();
    expect(component.step.karina.activeTextColor).toBeDefined();
  });

  it('should have valid, active, activeRoundColor and activeTextColor property for step Kai', () => {
    fixture.detectChanges();
    expect(typeof component.step.kai).toBe('object');
    expect(component.step.kai.valid).toBeDefined();
    expect(component.step.kai.active).toBeDefined();
    expect(component.step.kai.activeRoundColor).toBeDefined();
    expect(component.step.kai.activeTextColor).toBeDefined();
  });

  it('should have valid, active, activeRoundColor and activeTextColor property for step Completed', () => {
    fixture.detectChanges();
    expect(typeof component.step.completed).toBe('object');
    expect(component.step.completed.valid).toBeDefined();
    expect(component.step.completed.active).toBeDefined();
    expect(component.step.completed.activeRoundColor).toBeDefined();
    expect(component.step.completed.activeTextColor).toBeDefined();
  });

});
