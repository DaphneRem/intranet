import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesAchatDetailsComponent } from './fiches-achat-details.component';

describe('FichesAchatDetailsComponent', () => {
  let component: FichesAchatDetailsComponent;
  let fixture: ComponentFixture<FichesAchatDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesAchatDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesAchatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
