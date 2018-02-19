import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffusionsDatesTableComponent } from './diffusions-dates-table.component';

describe('DiffusionsDatesTableComponent', () => {
  let component: DiffusionsDatesTableComponent;
  let fixture: ComponentFixture<DiffusionsDatesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffusionsDatesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffusionsDatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
