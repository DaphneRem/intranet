import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScrollToTopComponent } from './scroll-to-top.component';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollToTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should have show property to false', () => {
    fixture.detectChanges();
    expect(component.show).toBeDefined();
    expect(component.show).toBe(false);
  });

  it('should call scrollToTop() function on back-to-top button click', fakeAsync( () => {
    component.show = true;
    fixture.detectChanges();
    spyOn(component, 'scrollToTop');
    const scrollClass = fixture.debugElement.query(By.css('.back-to-top'));
    const scrollBtn = scrollClass.nativeElement;
    scrollBtn.click();
    fixture.whenStable().then(() => {
      expect(component.scrollToTop).toHaveBeenCalled();
    });
  }));

});
