import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesAchatsTableComponent } from './fiches-achats-table.component';

describe('FichesAchatsTableComponent', () => {
  let component: FichesAchatsTableComponent;
  let fixture: ComponentFixture<FichesAchatsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesAchatsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesAchatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
