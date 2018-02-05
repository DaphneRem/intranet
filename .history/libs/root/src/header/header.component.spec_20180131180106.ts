import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, StateObservable, StoreModule } from '@ngrx/store';

// Components
import { HeaderComponent } from './header.component';
import { NavbarComponent } from '@app0/root/src/navbar/navbar.component';

// navbarState
import { navbarInitialState } from '../+state/navbar.init';
import { navbarReducer } from '../+state/navbar.reducer';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClickOutsideModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('navbar', navbarReducer, {
          initialState: navbarInitialState
        }),
        BrowserAnimationsModule
      ],
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: navbarReducer
        }
      ]
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
