import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { IngestsKaiComponent } from './ingests-kai.component';

describe('IngestsKaiComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: IngestsKaiComponent;
  let fixture: ComponentFixture<IngestsKaiComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IngestsKaiComponent, TestHostComponent],
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

  it('should have link property', () => {
    fixture = TestBed.createComponent(IngestsKaiComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should display view for 72h', () => {
    fixture = TestBed.createComponent(IngestsKaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.daysTableView).toBe(3);
  });

  it('should have headerTableLinkExist property to false', () => {
    fixture = TestBed.createComponent(IngestsKaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.headerTableLinkExist).toBe(false);
  });

  it('should have goBack property to true', () => {
    fixture = TestBed.createComponent(IngestsKaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.goBack).toBe(true);
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(IngestsKaiComponent)
    public IngestsKaiComponent: IngestsKaiComponent;
  }
});
