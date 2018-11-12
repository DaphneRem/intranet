import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedPackageModalComponent } from './expected-package-modal.component';

describe('ExpectedPackageModalComponent', () => {
  let component: ExpectedPackageModalComponent;
  let fixture: ComponentFixture<ExpectedPackageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedPackageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedPackageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
