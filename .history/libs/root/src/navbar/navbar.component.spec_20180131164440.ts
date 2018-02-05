
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MenuItems } from '..//menu-items/menu-items.service';
import { Store } from '@ngrx/store';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MenuItems, Store]
    }).compileComponents();

  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  @Component({
    selector: `host-component`,
    template: `<component-under-test></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(NavbarComponent)
    public componentUnderTestComponent: NavbarComponent;
  }
});






// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { NavbarComponent } from './navbar.component';
// import { MenuItems } from '..//menu-items/menu-items.service';
// import { Store } from '@ngrx/store';

// describe('NavbarComponent', () => {
//   let component: NavbarComponent;
//   let fixture: ComponentFixture<NavbarComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [NavbarComponent],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       providers: [
//         MenuItems,
//         Store
//       ]
//     }).compileComponents();
//         fixture = TestBed.createComponent(NavbarComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//   }));

//   beforeEach(() => {

//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

// });


// import {TestBed, ComponentFixture, inject, async} from '@angular/core/testing';
// import { NavbarComponent } from './navbar.component';
// import { Component, DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';


// describe('Component: Header', () => {

//   let component: NavbarComponent;
//   let fixture: ComponentFixture<NavbarComponent>;

//   beforeEach(() => {
//     // refine the test module by declaring the test component
//     TestBed.configureTestingModule({ declarations: [NavbarComponent] });

//     // create component and test fixture
//     fixture = TestBed.createComponent(NavbarComponent);

//     // get test component from the fixture
//     component = fixture.componentInstance;
//   });


// });

