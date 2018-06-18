import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFichesMaterielComponent } from './my-fiches-materiel.component';

describe('MyFichesMaterielComponent', () => {
  let component: MyFichesMaterielComponent;
  let fixture: ComponentFixture<MyFichesMaterielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFichesMaterielComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFichesMaterielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
