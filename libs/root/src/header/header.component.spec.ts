import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ClickOutsideModule } from 'ng-click-outside';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, StateObservable, StoreModule } from '@ngrx/store';

// Components
import { HeaderComponent } from './header.component';
import { NavbarComponent } from '../navbar/navbar.component';

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

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should have headerTitle property', () => {
    component.headerTitle = 'headerTitle';
    fixture.detectChanges();
    expect(component.headerTitle).toBeDefined();
  });

  it('should have logo property', () => {
    component.logo = 'logo';
    fixture.detectChanges();
    expect(component.logo).toBeDefined();
  });

  it('should call setNavbar() function ngOnInit', fakeAsync( () => {
    spyOn(component, 'setNavbar');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.setNavbar).toHaveBeenCalled();
    });
  }));

  it('should call setBackgroundPattern(e: string) function ngOnInit', fakeAsync( () => {
    spyOn(component, 'setBackgroundPattern');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.setBackgroundPattern).toHaveBeenCalled();
    });
  }));

  // it('should call searchOn() function on search-button click', fakeAsync( () => {
  //   fixture.detectChanges();
  //   spyOn(component, 'searchOn');
  //   const searchButton = fixture.debugElement.query(By.css('.search-btn'));
  //   const btn = searchButton.nativeElement;
  //   btn.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.searchOn).toHaveBeenCalled();
  //   });
  // }));

  // it('should call searchOff() function on search-close button click', fakeAsync( () => {
  //   // <span> click
  //   fixture.detectChanges();
  //   spyOn(component, 'searchOff');
  //   const offButton = fixture.debugElement.query(By.css('.search-close'));
  //   const offBtn = offButton.nativeElement;
  //   offBtn.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.searchOff).toHaveBeenCalled();
  //   });
  // }));

  // it('should call toggleProfileNotification() function on profil-button click', fakeAsync( () => {
  //   // <li> click
  //   fixture.detectChanges();
  //   spyOn(component, 'toggleProfileNotification');
  //   const profilButton = fixture.debugElement.query(By.css('.user-profile'));
  //   const profilBtn = profilButton.nativeElement;
  //   profilBtn.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.toggleProfileNotification).toHaveBeenCalled();
  //   });
  // }));

  // it('should call toggleLiveNotification() function on live-notifications button click', fakeAsync( () => {
  //   // <li> click
  //   fixture.detectChanges();
  //   spyOn(component, 'toggleLiveNotification');
  //   const notifButton = fixture.debugElement.query(By.css('.header-notification'));
  //   const notifBtn = notifButton.nativeElement;
  //   notifBtn.click();
  //   fixture.whenStable().then(() => {
  //     expect(component.toggleLiveNotification).toHaveBeenCalled();
  //   });
  // }));

  it('should call toggleOpened() function on menu-mobile button click', fakeAsync( () => {
    // <a> click
    fixture.detectChanges();
    spyOn(component, 'toggleOpened');
    const mobileButton = fixture.debugElement.query(By.css('.mobile-menu'));
    const mobileBtn = mobileButton.nativeElement;
    mobileBtn.click();
    fixture.whenStable().then(() => {
      expect(component.toggleOpened).toHaveBeenCalled();
    });
  }));

  it('should call toggleHeaderNavRight() function on mobile-options button click', fakeAsync(() => {
      // <a> click
      fixture.detectChanges();
      spyOn(component, 'toggleHeaderNavRight');
      const mobileButton = fixture.debugElement.query(By.css('.mobile-options'));
      const mobileBtn = mobileButton.nativeElement;
      mobileBtn.click();
      fixture.whenStable().then(() => {
        expect(component.toggleHeaderNavRight).toHaveBeenCalled();
    });
  }));

});
