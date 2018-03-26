import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { WidgetLinkComponent } from './widget-link.component';

const dataTesting = {
  title: 'title',
  icon: 'icofont',
  size: 'col-md-12 col-lg-6 ',
  link: './karina-waiting',
  color: 'red'
};

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);


describe('WidgetLinkComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let fixture;
  let component;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [WidgetLinkComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('should have a widget object', () => {
    fixture = TestBed.createComponent(WidgetLinkComponent);
    component = fixture.componentInstance;
    component.widget = dataTesting;
    expect(component.widget).toBeDefined();
  });

  it('should have title', () => {
    fixture = TestBed.createComponent(WidgetLinkComponent);
    component = fixture.componentInstance;
    component.widget = dataTesting;
    fixture.detectChanges();
    const de = fixture.debugElement.nativeElement.querySelector('h4');
    const content = de.textContent;
    expect(content).toContain(dataTesting.title);
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(WidgetLinkComponent)
    public WidgetLinkComponent: WidgetLinkComponent;
  }
});
