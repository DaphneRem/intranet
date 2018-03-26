import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, async, TestBed, fakeAsync } from '@angular/core/testing';
import { Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF,  } from '@angular/common';
import { By } from '@angular/platform-browser';

import { ErrorWidgetComponent } from './error-widget.component';

describe('ErrorWidgetComponent', () => {
  let component: ErrorWidgetComponent;
  let fixture: ComponentFixture<ErrorWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorWidgetComponent],
      providers: [
        { provide: Location, useClass: location },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/my/app' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWidgetComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should have 404 error title', () => {
    component.error = '404';
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('.title'));
    const el = de.nativeElement;
    const content = el.textContent;
    expect(content).toContain('44');
  });

  it('should call goBack() function on button click', fakeAsync( () => {
    component.error = '404';
    fixture.detectChanges();
    spyOn(component, 'goBack');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goBack).toHaveBeenCalled();
    });
  }));

});
