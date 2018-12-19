import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';

import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastyModule } from 'ng2-toasty';

describe('NotificationComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ ToastyModule ],
      declarations: [ NotificationComponent, TestHostComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have showClose property', () => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    component.showClose = true;
    fixture.detectChanges();
    expect(component.showClose).toBeDefined();
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(NotificationComponent)
    public NotificationComponen: NotificationComponent;
  }

});


