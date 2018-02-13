import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsTablePurgeComponent } from './ingests-table-purge.component';

describe('IngestsTablePurgeComponent', () => {
  let component: IngestsTablePurgeComponent;
  let fixture: ComponentFixture<IngestsTablePurgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsTablePurgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsTablePurgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
