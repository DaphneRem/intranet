import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsAllTableComponent } from './playlists-all-table.component';

describe('PlaylistsAllTableComponent', () => {
  let component: PlaylistsAllTableComponent;
  let fixture: ComponentFixture<PlaylistsAllTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsAllTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsAllTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
