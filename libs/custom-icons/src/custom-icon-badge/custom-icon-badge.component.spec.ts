import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomIconBadgeComponent } from './custom-icon-badge.component';

describe('CustomIconBadgeComponent', () => {
  let component: CustomIconBadgeComponent;
  let fixture: ComponentFixture<CustomIconBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomIconBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomIconBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
