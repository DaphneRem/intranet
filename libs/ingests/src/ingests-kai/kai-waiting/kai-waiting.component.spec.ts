import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaiWaitingComponent } from './kai-waiting.component';

describe('KaiWaitingComponent', () => {
  let component: KaiWaitingComponent;
  let fixture: ComponentFixture<KaiWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaiWaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaiWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
