import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SubHeaderComponent } from './sub-header.component';

describe('SubHeaderComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SubHeaderComponent, TestHostComponent],
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

  it('should have uppercase title', () => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    component.title = 'title';
    fixture.detectChanges();
    const de = fixture.debugElement.nativeElement.querySelector('h2');
    const content = de.textContent;
    expect(content).toContain(component.title.toUpperCase());
  });

  it('should have changeView property', () => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    component.changeView = true;
    fixture.detectChanges();
    expect(component.changeView).toBeDefined();
  });

  it('should have goBack property', () => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    component.goBack = true;
    fixture.detectChanges();
    expect(component.goBack).toBeDefined();
  });

  it('should have link property', () => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    component.link = 'fakeLink';
    fixture.detectChanges();
    expect(component.link).toBeDefined();
  });

  it('should have tableView property', () => {
    fixture = TestBed.createComponent(SubHeaderComponent);
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
    @ViewChild(SubHeaderComponent)
    public SubHeaderComponent: SubHeaderComponent;
  }

});


