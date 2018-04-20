import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsErrorsDetailsComponent } from './playlists-errors-details.component';

describe('PlaylistsErrorsDetailsComponent', () => {
  let component: PlaylistsErrorsDetailsComponent;
  let fixture: ComponentFixture<PlaylistsErrorsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsErrorsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsErrorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
