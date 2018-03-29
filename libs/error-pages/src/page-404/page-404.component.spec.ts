import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { Page404Component } from './page-404.component';

describe('Page404Component', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [Page404Component, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    fixture = TestBed.createComponent(Page404Component);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('display "404" error', () => {
    expect(component.error).toEqual('404');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(Page404Component)
    public Page404Component: Page404Component;
  }
});
