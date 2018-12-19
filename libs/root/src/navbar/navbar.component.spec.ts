
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StateObservable, StoreModule } from '@ngrx/store';

import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from '../accordion/index';
import { MenuItems } from '../menu-items/menu-items.service';
import { NavbarComponent } from './navbar.component';

// navbarState
import { navbarInitialState } from '../+state/navbar.init';
import { navbarReducer } from '../+state/navbar.reducer';

const fakeThemeAttributes: any = {
  navBarTheme: 'navbar-theme',
  activeItemTheme: 'active-item-theme',
  itemBorder: 'item-border',
  itemBorderStyle: 'item-border-style',
  subItemBorder: 'sub-item-border',
  dropDownIcon: 'drop-down-icon',
  subItemIcon: 'sub-item-icon',
};

const fakeHeaderAttributes: any = {
  headerFixedMargin: 'header-fixed-margin',
  windowWidth: 1000,
  toggleOn: true,
  verticalNavType: 'vertical-nav-type',
  verticalEffect: 'vertical-effects',
  isHeaderChecked: 'is-header-checked',
  sidebarFixedHeight: 'sidebar-fixed-height',
  pcodedHeaderPosition: 'pcoded-header-position',
  pcodedSidebarPosition: 'pcoded-sidebar-position',
};

describe('NavbarComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        NgbModule.forRoot(),
        RouterTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('navbar', navbarReducer, {
          initialState: navbarInitialState
        }),
      ],
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

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have navbarTheme attributes', () => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.navBarTheme = fakeThemeAttributes.navBarTheme;
    component.activeItemTheme = fakeThemeAttributes.activeItemTheme,
    component.itemBorder = fakeThemeAttributes.itemBorder;
    component.itemBorderStyle = fakeThemeAttributes.itemBorderStyle;
    component.subItemBorder = fakeThemeAttributes.subItemBorder;
    component.dropDownIcon = fakeThemeAttributes.dropDownIcon;
    component.subItemIcon = fakeThemeAttributes.subItemIcon;
    expect(component.navBarTheme).toBeDefined();
    expect(component.activeItemTheme).toBeDefined();
    expect(component.itemBorder).toBeDefined();
    expect(component.itemBorderStyle).toBeDefined();
    expect(component.subItemBorder).toBeDefined();
    expect(component.dropDownIcon).toBeDefined();
    expect(component.subItemIcon).toBeDefined();
  });

  it('should have header attributes', () => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.headerFixedMargin = fakeHeaderAttributes.headerFixedMargin;
    component.windowWidth = fakeHeaderAttributes.windowWidth,
    component.toggleOn = fakeHeaderAttributes.toggleOn;
    component.verticalNavType = fakeHeaderAttributes.verticalNavType;
    component.verticalEffect = fakeHeaderAttributes.verticalEffect;
    component.isHeaderChecked = fakeHeaderAttributes.isHeaderChecked;
    component.sidebarFixedHeight = fakeHeaderAttributes.sidebarFixedHeight;
    component.pcodedHeaderPosition = fakeHeaderAttributes.pcodedHeaderPosition;
    component.pcodedSidebarPosition = fakeHeaderAttributes.pcodedSidebarPosition;
    expect(component.headerFixedMargin).toBeDefined();
    expect(component.windowWidth).toBeDefined();
    expect(component.toggleOn).toBeDefined();
    expect(component.verticalNavType).toBeDefined();
    expect(component.verticalEffect).toBeDefined();
    expect(component.isHeaderChecked).toBeDefined();
    expect(component.sidebarFixedHeight).toBeDefined();
    expect(component.pcodedHeaderPosition).toBeDefined();
    expect(component.pcodedSidebarPosition).toBeDefined();
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
