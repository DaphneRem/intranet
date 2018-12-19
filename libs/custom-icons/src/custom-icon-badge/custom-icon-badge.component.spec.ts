import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CustomIconBadgeComponent } from './custom-icon-badge.component';

describe('CustomIconBadgeComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: CustomIconBadgeComponent;
  let fixture: ComponentFixture<CustomIconBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomIconBadgeComponent,
        TestHostComponent
      ],
      imports: [
        RouterTestingModule
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

  it('should have bigIcon property', () => {
    fixture = TestBed.createComponent(CustomIconBadgeComponent);
    component = fixture.componentInstance;
    component.bigIcon = 'icofont icofont-check-alt';
    expect(component.bigIcon).toBeDefined();
  });

  it('should have littleIcon property', () => {
    fixture = TestBed.createComponent(CustomIconBadgeComponent);
    component = fixture.componentInstance;
    component.littleIcon = 'icofont icofont-check-alt';
    expect(component.littleIcon).toBeDefined();
  });

  it('should have link property', () => {
    fixture = TestBed.createComponent(CustomIconBadgeComponent);
    component = fixture.componentInstance;
    component.link = './foo';
    expect(component.link).toBeDefined();
  });


  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(CustomIconBadgeComponent)
    public CustomIconBadgeComponent: CustomIconBadgeComponent;
  }
});
