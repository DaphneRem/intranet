import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsKaiComponent } from './ingests-kai.component';

describe('IngestsKaiComponent', () => {
  let component: IngestsKaiComponent;
  let fixture: ComponentFixture<IngestsKaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsKaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsKaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
