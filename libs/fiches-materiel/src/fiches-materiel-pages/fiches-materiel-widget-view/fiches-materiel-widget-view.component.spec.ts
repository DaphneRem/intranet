import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichesMaterielWidgetViewComponent } from './fiches-materiel-widget-view.component';

describe('FichesMaterielWidgetViewComponent', () => {
  let component: FichesMaterielWidgetViewComponent;
  let fixture: ComponentFixture<FichesMaterielWidgetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichesMaterielWidgetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichesMaterielWidgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
