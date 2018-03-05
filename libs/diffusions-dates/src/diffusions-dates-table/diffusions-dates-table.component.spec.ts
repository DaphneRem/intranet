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

  it('convertTime function ', () => {
    expect(component.convertTime(3600, 30)).toBe('108000');
  });
  // test Fonction validation numero de programme
/*
  const datasForm = {
    'channels': [
      { 'id': 0, 'itemName': 'LIBRE' },
      { 'id': 1, 'itemName': 'AB 1' } ],
      'type': 'Grille',
      'datesRange': { 'date1': '2017-12-01T23:00:00.000Z', 'date2': '2017-12-15T23:00:00.000Z' },
      'programName': '1994-12345'
    };

  it('Test fonction validation numero programme', () => {
    expect(component.numProgramValidator).toBe(false, 'date renseignée > avant 1996');
  });
*/

});
