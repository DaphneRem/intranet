import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerTitle: DebugElement;
  let logo: DebugElement;
  let headerNav: DebugElement;
  let expectedTitle: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;


    expectedTitle = 'app';
    component.headerTitle = expectedTitle;


    fixture.detectChanges();
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

  // @Input() headerTitle: string;
  // @Input() logo: string;

  // @Output() headerNav: EventEmitter<boolean> = new EventEmitter<boolean>();