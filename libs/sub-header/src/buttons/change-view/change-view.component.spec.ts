import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ChangeViewComponent } from './change-view.component';

describe('ChangeViewComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: ChangeViewComponent;
  let fixture: ComponentFixture<ChangeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ChangeViewComponent, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeTruthy();
  });

  it('should have link property', () => {
    fixture = TestBed.createComponent(ChangeViewComponent);
    component = fixture.componentInstance;
    component.link = 'fakeLink';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should have tableView property', () => {
    fixture = TestBed.createComponent(ChangeViewComponent);
    component = fixture.componentInstance;
    component.tableView = true;
    fixture.detectChanges();
    expect(component.tableView).toBeDefined();
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(ChangeViewComponent)
    public ChangeViewComponent: ChangeViewComponent;
  }

});

