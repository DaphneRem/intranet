import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { WidgetDataComponent } from './widget-data.component';

const dataTesting = {
  headerTitle : 'Title',
  headerColor : 'color',
  minHeight : 180,
  size : 2,
  rows : [
    {
      title: 'Programme',
      data : 'mockNumprogram',
    },
    {
      title: 'Episode',
      data: 'mockNumepisode',
    },
    {
      title: 'Durée',
      data: 'mockDurant',
    }
  ]
};

describe('WidgetDataComponent', () => {
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: WidgetDataComponent;
  let fixture: ComponentFixture<WidgetDataComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [WidgetDataComponent, TestHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    fixture = TestBed.createComponent(WidgetDataComponent);
    component = fixture.componentInstance;
    component.data = dataTesting;

  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have object of colors ', () => {
    const colors = typeof component.widgetsColors;
    expect(colors).toBe('object');
  });

  it('should have data array ', () => {
    expect(component.data).toBeDefined();
  });

  it('should have title', fakeAsync(() => {
    expect(component.data.headerTitle).toEqual(dataTesting.headerTitle);
    })
  );

  it('should display title on h5 element', () => {
    fixture.detectChanges();
    const h5 = fixture.debugElement.nativeElement.querySelector('h5');
    const content = h5.textContent;
    expect(content).toContain(component.data.headerTitle);
  });

  it('should display rows title', fakeAsync(() => {
    fixture.detectChanges();
    const rowTitle = fixture.debugElement.query(By.css('.item-title'));
    const el = rowTitle.nativeElement;
    const content = el.textContent;
    expect(content).toContain(component.data.rows[0].title);
  }));

  it('should display "/" if data row no exist', fakeAsync(() => {
    dataTesting.rows[0].data = null;
    fixture.detectChanges();
    const noData = fixture.debugElement.query(By.css('.th-data'));
    const el = noData.nativeElement;
    const content = el.textContent;
    expect(content).toBe('/');
  }));

  it('should change date format', fakeAsync(() => {
    dataTesting.rows[0].data = '2018-03-19T15:45:31.547';
    fixture.detectChanges();
    const noData = fixture.debugElement.query(By.css('.th-data'));
    const el = noData.nativeElement;
    const content = el.textContent;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(content);
    const dateFormat = date.toLocaleDateString('fr-FR', options);
    const timeFormat = date.toLocaleTimeString('fr-FR');
    expect(`${dateFormat} à ${timeFormat}`).toBe('19 mars 2018 à 15:45:31');
  }));

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(WidgetDataComponent)
    public WidgetDataComponent: WidgetDataComponent;
  }
});
