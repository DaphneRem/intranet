import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesAchatTableComponent } from './fiches-achat-table.component';

describe('FichesAchatTableComponent', () => {
  let component: FichesAchatTableComponent;
  let fixture: ComponentFixture<FichesAchatTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesAchatTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesAchatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
