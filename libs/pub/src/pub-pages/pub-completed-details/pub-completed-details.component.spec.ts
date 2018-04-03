import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { PubCompletedDetailsComponent } from './pub-completed-details.component';

describe('PubCompletedDetailsComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PubCompletedDetailsComponent;
  let fixture: ComponentFixture<PubCompletedDetailsComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [PubCompletedDetailsComponent, TestHostComponent],
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
    fixture = TestBed.createComponent(PubCompletedDetailsComponent);
    component = fixture.componentInstance;
    component.link = '/link';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should display view for 72h', () => {
    fixture = TestBed.createComponent(PubCompletedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.daysTableView).toBe(3);
  });

  it('should have headerTableLinkExist property to false', () => {
    fixture = TestBed.createComponent(PubCompletedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.headerTableLinkExist).toBe(false);
  });

  it('should have goBack property to true', () => {
    fixture = TestBed.createComponent(PubCompletedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.goBack).toBe(true);
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PubCompletedDetailsComponent) public SubHeaderComponent: PubCompletedDetailsComponent;
  }

});


