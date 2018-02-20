import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaiEchecComponent } from './kai-echec.component';

describe('KaiEchecComponent', () => {
  let component: KaiEchecComponent;
  let fixture: ComponentFixture<KaiEchecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaiEchecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaiEchecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
