import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielBtnLinksComponent } from './fiches-materiel-btn-links.component';

describe('FichesMaterielBtnLinksComponent', () => {
  let component: FichesMaterielBtnLinksComponent;
  let fixture: ComponentFixture<FichesMaterielBtnLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielBtnLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielBtnLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
