import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielAllComponent } from './fiches-materiel-all.component';

describe('FichesMaterielAllComponent', () => {
  let component: FichesMaterielAllComponent;
  let fixture: ComponentFixture<FichesMaterielAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
