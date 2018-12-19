import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsStatusCommentModalComponent } from './steps-status-comment-modal.component';

describe('StepsStatusCommentModalComponent', () => {
  let component: StepsStatusCommentModalComponent;
  let fixture: ComponentFixture<StepsStatusCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepsStatusCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepsStatusCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
