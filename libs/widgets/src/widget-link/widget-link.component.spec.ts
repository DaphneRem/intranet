import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WidgetLinkComponent } from './widget-link.component';

describe('WidgetLinkComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [WidgetLinkComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterModule]
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
    @ViewChild(WidgetLinkComponent)
    public WidgetLinkComponent: WidgetLinkComponent;
  }
});
