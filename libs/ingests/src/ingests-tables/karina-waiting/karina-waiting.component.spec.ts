import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KarinaWaitingComponent } from './karina-waiting.component';

describe('KarinaWaitingComponent', () => {
  let component: KarinaWaitingComponent;
  let fixture: ComponentFixture<KarinaWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KarinaWaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KarinaWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
