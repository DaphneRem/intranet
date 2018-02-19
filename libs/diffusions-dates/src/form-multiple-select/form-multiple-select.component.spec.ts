import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultipleSelectComponent } from './form-multiple-select.component';

describe('FormMultipleSelectComponent', () => {
  let component: FormMultipleSelectComponent;
  let fixture: ComponentFixture<FormMultipleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMultipleSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMultipleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
