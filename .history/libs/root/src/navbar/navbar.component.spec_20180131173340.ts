
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MenuItems } from '..//menu-items/menu-items.service';
import { Store } from '@ngrx/store';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from '../accordion/index';


describe('NavbarComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
        TestHostComponent,
        AccordionAnchorDirective,
        AccordionDirective,
        AccordionLinkDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

  }));

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
    @ViewChild(NavbarComponent)
    public NavbarComponent: NavbarComponent;
  }

});