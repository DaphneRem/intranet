import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectWorkorderComponent } from './multiselect-workorder.component';

describe('MultiselectWorkorderComponent', () => {
  let component: MultiselectWorkorderComponent;
  let fixture: ComponentFixture<MultiselectWorkorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectWorkorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectWorkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
