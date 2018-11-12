import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectedEpisodesModalComponent } from './affected-episodes-modal.component';

describe('AffectedEpisodesModalComponent', () => {
  let component: AffectedEpisodesModalComponent;
  let fixture: ComponentFixture<AffectedEpisodesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectedEpisodesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectedEpisodesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
