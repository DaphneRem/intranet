import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { TraceSegmentComponent } from './trace-segment.component';

describe('TraceSegmentComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: TraceSegmentComponent;
  let fixture: ComponentFixture<TraceSegmentComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [TraceSegmentComponent, TestHostComponent],
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

  it('should have title property "details fichier"', () => {
    fixture = TestBed.createComponent(TraceSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.title).toBe('details fichier');
  });

  it('should have file object', () => {
    fixture = TestBed.createComponent(TraceSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.file).toBeDefined();
    expect(typeof component.file).toBe('object');
  });

  it('should call checkFilling() function ngOnInit', fakeAsync( () => {
    fixture = TestBed.createComponent(TraceSegmentComponent);
    component = fixture.componentInstance;
    spyOn(component, 'checkFilling');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.checkFilling).toHaveBeenCalled();
    });
  }));

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(TraceSegmentComponent)
    public TraceSegmentComponent: TraceSegmentComponent;
  }
});
