import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoaderAnimationComponent } from './loader-animation.component';

describe('LoaderAnimationComponent', () => {
  let component: LoaderAnimationComponent;
  let fixture: ComponentFixture<LoaderAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have loader', () => {
    const de = fixture.debugElement.query(By.css('.loader'));
    const el = de.nativeElement;
    expect(el).toBeDefined();
  });

});
