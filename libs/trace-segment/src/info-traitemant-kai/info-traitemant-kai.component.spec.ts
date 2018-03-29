import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { InfoTraitemantKaiComponent } from './info-traitemant-kai.component';

describe('InfoTraitemantKaiComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let component: InfoTraitemantKaiComponent;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [InfoTraitemantKaiComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

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
    @ViewChild(InfoTraitemantKaiComponent)
    public InfoTraitemantKaiComponent: InfoTraitemantKaiComponent;
  }
});
