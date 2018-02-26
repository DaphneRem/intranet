import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestsPurgedComponent } from './ingests-purged.component';

describe('IngestsTablePurgeComponent', () => {
  let component: IngestsPurgedComponent;
  let fixture: ComponentFixture<IngestsPurgedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngestsPurgedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestsPurgedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
