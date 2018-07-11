import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielTableComponent } from './fiches-materiel-table.component';

describe('FichesMaterielTableComponent', () => {
  let component: FichesMaterielTableComponent;
  let fixture: ComponentFixture<FichesMaterielTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
