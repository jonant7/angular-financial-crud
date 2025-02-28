import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ColumnType, FinancialTableComponent} from './financial-table.component';
import {DatePipe} from '@angular/common';
import {createMockProducts} from '../../../models/products/product-factory';
import {By} from "@angular/platform-browser";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('FinancialTableComponent', () => {
    let component: FinancialTableComponent;
    let fixture: ComponentFixture<FinancialTableComponent>;

    beforeEach(async () => {
       await TestBed.configureTestingModule({
            imports: [FinancialTableComponent],
            providers: [DatePipe, provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialTableComponent);
        component = fixture.componentInstance;
    });

    it('should initialize filteredData and highlightedData on ngOnChanges', () => {
        const mockProducts = createMockProducts(1);
        component.data = mockProducts;
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.ngOnChanges();

        expect(component.filteredData).toEqual(mockProducts);
        expect(component.highlightedData).toEqual(mockProducts);
    });

    it('should filter data based on search term', () => {
        component.data = createMockProducts(2);
        component.columns = [
            {name: 'name', label: 'Name', type: ColumnType.TEXT},
            {name: 'dateRelease', label: 'Release Date', type: ColumnType.DATE}
        ];

        const event = {target: {value: 'Product 2'}};
        component.onSearch(event as any);

        expect(component.filteredData.length).toBe(1);
        expect(component.filteredData[0].name).toBe('Product 2');
    });

    it('should reset filteredData if search term is empty', () => {
        component.data = createMockProducts(2);
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT, align: "left"}];

        component.onSearch({target: {value: ''}} as any);

        expect(component.filteredData.length).toBe(2);
    });

    it('should highlight search term in the highlightedData after onSearch', () => {
        component.data = createMockProducts(1);
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.searchTerm = 'Product 1';

        const event = {target: {value: 'Product 1'}};
        component.onSearch(event as any);

        expect(component.highlightedData[0].name).toContain('<mark>Product 1</mark>');
    });

    it('should return the value with highlights', () => {
        const result = component.applyHighlight('Hello World', 'world');
        expect(result).toBe('Hello <mark>World</mark>');
    });

    it('should return the original value if term is not found', () => {
        const result = component.applyHighlight('Hello World', 'foo');
        expect(result).toBe('Hello World');
    });

    it('should display no data message when highlightedData is empty', () => {
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.highlightedData = [];

        fixture.detectChanges();
        const compiled = fixture.nativeElement;

        expect(compiled.querySelector('.no-data').textContent).toContain('No hay datos disponibles');
    });

    it('should update the highlighted data and total count when page size is changed', () => {
        component.data = createMockProducts(20);
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.pageSizeOption = 5;
        component.ngOnChanges();

        expect(component.highlightedData.length).toBe(5);
        expect(component.totalCount).toBe(5);

        component.onRecordsChange({target: {value: '20'}} as any);
        expect(component.highlightedData.length).toBe(20);
        expect(component.totalCount).toBe(20);
    });

    it('should correctly calculate total count for filtered data', () => {
        component.data = createMockProducts(5);
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.ngOnChanges();

        expect(component.totalCount).toBe(5);

        const event = {target: {value: 'Product 1'}};
        component.onSearch(event as any);

        expect(component.totalCount).toBe(1);
        expect(component.highlightedData.length).toBe(1);
    });

    it('should display "No hay datos disponibles" message when data is empty', () => {
        component.columns = [{name: 'name', label: 'Name', type: ColumnType.TEXT}];
        component.highlightedData = [];

        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.no-data').textContent).toContain('No hay datos disponibles');
    });

    it('should show button when buttonLink is provided', () => {
        component.buttonLink = '/some-path';
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('a.btn-yellow'));
        expect(button).toBeTruthy();
    });

    it('should not show button when buttonLink is empty', () => {
        component.buttonLink = '';
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('a.btn-yellow'));
        expect(button).toBeFalsy();
    });

});
