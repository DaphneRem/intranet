import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { WidgetErrorComponent } from './widget-error.component';

describe('WidgetErrorComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: WidgetErrorComponent;
  let fixture: ComponentFixture<WidgetErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetErrorComponent, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(WidgetErrorComponent)
    public WidgetErrorComponent: WidgetErrorComponent;
  }
});


