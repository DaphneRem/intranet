import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view.component';

describe('IngestsWidgetsViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IngestsWidgetsViewComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create', () => {
    expect(testHostFixture).toBeTruthy();
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(IngestsWidgetsViewComponent)
    public IngestsWidgetsViewComponent: IngestsWidgetsViewComponent;
  }
});
