import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsErrorsTableComponent } from './playlists-errors-table.component';

describe('PlaylistsErrorsTableComponent', () => {
  let component: PlaylistsErrorsTableComponent;
  let fixture: ComponentFixture<PlaylistsErrorsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsErrorsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsErrorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
