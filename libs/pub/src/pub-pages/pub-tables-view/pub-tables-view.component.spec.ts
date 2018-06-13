import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { PubTablesViewComponent } from './pub-tables-view.component';

describe('PubTablesViewComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PubTablesViewComponent;
  let fixture: ComponentFixture<PubTablesViewComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [PubTablesViewComponent, TestHostComponent],
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

  it('should have link property', () => {
    fixture = TestBed.createComponent(PubTablesViewComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should display view for 24h', () => {
    fixture = TestBed.createComponent(PubTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.view24h).toBe(1);
  });

  it('should display view for 72h', () => {
    fixture = TestBed.createComponent(PubTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.view72h).toBe(3);
  });

  it('should have completedTableLink link to "./completed" ', () => {
    fixture = TestBed.createComponent(PubTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.completedTableLink).toBe('./completed');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PubTablesViewComponent) public SubHeaderComponent: PubTablesViewComponent;
  }

});
