import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFichesMaterielAllComponent } from './my-fiches-materiel-all.component';

describe('MyFichesMaterielAllComponent', () => {
  let component: MyFichesMaterielAllComponent;
  let fixture: ComponentFixture<MyFichesMaterielAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFichesMaterielAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFichesMaterielAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
