import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Page403AppComponent } from './page-403-App.component';

describe('Page403AppComponent', () => {
  let component:  Page403AppComponent;
  let fixture: ComponentFixture< Page403AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  Page403AppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( Page403AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
