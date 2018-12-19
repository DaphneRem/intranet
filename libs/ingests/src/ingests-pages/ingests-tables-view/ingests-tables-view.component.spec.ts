import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { IngestsTablesViewComponent } from './ingests-tables-view.component';

describe('IngestsTablesViewComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: IngestsTablesViewComponent;
  let fixture: ComponentFixture<IngestsTablesViewComponent>;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IngestsTablesViewComponent, TestHostComponent],
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
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should display view for 24h', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.view24h).toBe(1);
  });

  it('should display view for 72h', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.view72h).toBe(3);
  });

  it('should have completedTableLink link to "./completed" ', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.completedTableLink).toBe('./completed');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(IngestsTablesViewComponent)
    public IngestsTablesViewComponent: IngestsTablesViewComponent;
  }
});
