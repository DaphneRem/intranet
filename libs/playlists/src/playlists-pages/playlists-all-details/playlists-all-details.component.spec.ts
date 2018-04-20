import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsAllDetailsComponent } from './playlists-all-details.component';

describe('PlaylistsAllDetailsComponent', () => {
  let component: PlaylistsAllDetailsComponent;
  let fixture: ComponentFixture<PlaylistsAllDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsAllDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsAllDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
