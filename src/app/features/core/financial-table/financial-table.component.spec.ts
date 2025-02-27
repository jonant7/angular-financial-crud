import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ColumnType, FinancialTableComponent} from './financial-table.component';
import {By} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';

describe('FinancialTableComponent', () => {
  let component: FinancialTableComponent;
  let fixture: ComponentFixture<FinancialTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinancialTableComponent],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialTableComponent);
    component = fixture.componentInstance;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should render table headers correctly', () => {
    component.columns = [
      {name: 'name', label: 'Name', type: ColumnType.TEXT},
      {name: 'date', label: 'Date', type: ColumnType.DATE}
    ];
    fixture.detectChanges();

    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(2);
    expect(headers[0].nativeElement.textContent.trim()).toBe('Name');
    expect(headers[1].nativeElement.textContent.trim()).toBe('Date');
  });

  test('should render data correctly in the table', () => {
    component.columns = [
      {name: 'name', label: 'Name', type: ColumnType.TEXT},
      {name: 'date', label: 'Date', type: ColumnType.DATE}
    ];
    component.data = [
      {name: 'Product 1', date: '2024-02-27'},
      {name: 'Product 2', date: '2025-03-01'}
    ];
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const cells = rows[0].queryAll(By.css('td'));
    expect(cells[0].nativeElement.textContent.trim()).toBe('Product 1');
    expect(cells[1].nativeElement.textContent.trim()).toBe('27/02/2024'); // Formatted date
  });

  test('should render images correctly', () => {
    component.columns = [{name: 'logo', label: 'Logo', type: ColumnType.IMAGE}];
    component.data = [{logo: 'image-url.png'}];
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.nativeElement.src).toContain('image-url.png');
  });

  test('should show "No hay datos disponibles"" when there are no data', () => {
    component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
    component.data = [];
    fixture.detectChanges();

    const noDataElement = fixture.debugElement.query(By.css('.no-data'));
    expect(noDataElement.nativeElement.textContent.trim()).toBe('No hay datos disponibles');
  });

});
