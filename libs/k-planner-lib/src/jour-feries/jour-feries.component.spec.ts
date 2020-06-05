import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourFeriesComponent } from './jour-feries.component';

describe('JourFeriesComponent', () => {
  let component: JourFeriesComponent;
  let fixture: ComponentFixture<JourFeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourFeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourFeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
