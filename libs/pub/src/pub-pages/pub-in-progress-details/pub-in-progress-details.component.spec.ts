import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';

import { PubInProgressDetailsComponent } from './pub-in-progress-details.component';

describe('PubInProgressDetailsComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: PubInProgressDetailsComponent;
  let fixture: ComponentFixture<PubInProgressDetailsComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [PubInProgressDetailsComponent, TestHostComponent],
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

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(PubInProgressDetailsComponent) public SubHeaderComponent: PubInProgressDetailsComponent;
  }

});
