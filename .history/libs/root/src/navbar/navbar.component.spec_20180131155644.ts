import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
  }));

  beforeEach(() => {

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


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

