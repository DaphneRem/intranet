import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielCreationComponent } from './fiches-materiel-creation.component';

describe('FichesMaterielCreationComponent', () => {
  let component: FichesMaterielCreationComponent;
  let fixture: ComponentFixture<FichesMaterielCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
