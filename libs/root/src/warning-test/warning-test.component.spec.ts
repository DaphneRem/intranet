import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningTestComponent } from './warning-test.component';

describe('WarningTestComponent', () => {
  let component: WarningTestComponent;
  let fixture: ComponentFixture<WarningTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
