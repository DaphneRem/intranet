import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
import { CUSTOM_ELEMENTS_SCHEMA, ViewChild } from "@angular/core";
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

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

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

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a logo`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.heade);
  }))
  ;
  beforeEach(() => {

  });

  it("should create", () => {
    expect(testHostFixture).toBeTruthy();
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(NavbarComponent) public NavbarComponent: NavbarComponent;
  }
});
