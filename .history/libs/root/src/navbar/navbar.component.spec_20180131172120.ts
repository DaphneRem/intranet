
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MenuItems } from '..//menu-items/menu-items.service';
import { Store } from '@ngrx/store';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        PerfectScrollbarModule
      ],
      declarations: [NavbarComponent, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        MenuItems,
        Store,
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(NavbarComponent)
    public NavbarComponent: NavbarComponent;
  }

});