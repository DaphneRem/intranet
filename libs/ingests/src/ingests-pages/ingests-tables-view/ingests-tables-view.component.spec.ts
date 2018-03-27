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
    expect(component.daysTableView).toBe(1);
  });

  it('should have headerTableLinkExist property to true', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.headerTableLinkExist).toBe(true);
  });

  it('should have inProgressTableLink link to "../in-progress" ', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.inProgressTableLink).toBe('../in-progress');
  });

  it('should have completedTableLink link to "../completed" ', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.completedTableLink).toBe('../completed');
  });

  it('should have kaiTableLink link to "../kai-waiting" ', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.kaiTableLink).toBe('../kai-waiting');
  });

  it('should have karinaTableLink link to "../karina-waiting" ', () => {
    fixture = TestBed.createComponent(IngestsTablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.karinaTableLink).toBe('../karina-waiting');
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
