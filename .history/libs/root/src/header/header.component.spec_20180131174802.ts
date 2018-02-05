import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { Store, StateObservable, StoreModule } from '@ngrx/store';
import { NavbarComponent } from '@app0/root/src/navbar/navbar.component';
import { Observable } from 'rxjs/Observable';
import { navbarReducer } from '../+state/navbar.reducer';
import { navbarInitialState } from '../+state/navbar.init';
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClickOutsideModule,
        StoreModule.forFeature('navbar', navbarReducer, {
          initialState: navbarInitialState
        })
      ],
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [Store]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
